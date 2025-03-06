import { PresetCropOptions } from '@/data/ui/data';
import { Version } from '@/types/visualLibrary';
import React, { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import ReactCrop, { 
  centerCrop, 
  makeAspectCrop, 
  Crop, 
  PixelCrop 
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import PresetCropButton from '../miscellaneous/PresetCropButton';
import { CloseIcon } from '@/assets/icons/AssetIcons';
import {Crop as CropIcon } from 'lucide-react';

interface ImageEditWindowProp {
    setImageEditWindow: Dispatch<SetStateAction<boolean>>
    mediaVersion : Version | null
}

const ImageEditWindow: FC<ImageEditWindowProp> = ({ setImageEditWindow,mediaVersion }) => {
    const [imgSrc, setImgSrc] = useState<string>(mediaVersion?.fileURL||"");
    const [crop, setCrop] = useState<Crop | null>(null);
    const [aspect, setAspect] = useState<number>(16 / 9); // Default aspect ratio
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
    const imgRef = useRef<HTMLImageElement>(null);
  
    // function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    //   if (e.target.files && e.target.files.length > 0) {
    //     const reader = new FileReader();
    //     reader.addEventListener('load', () =>
    //       setImgSrc(reader.result?.toString() || '')
    //     );
    //     reader.readAsDataURL(e.target.files[0]);
    //   }
    // }
  
    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
      const { width, height } = e.currentTarget;
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          width,
          height
        ),
        width,
        height
      );
      
      setCrop(initialCrop);
    }
  
    function getCroppedImg() {
      if (!crop || !imgRef.current) return;
    
      const canvas = document.createElement('canvas');
      // Set canvas dimensions
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
    
      if (!ctx) return;
    
      // Draw the cropped portion
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      
      // Instead of extracting data, use the canvas element directly
      const resultContainer = document.getElementById('cropped-result-container');
      if (resultContainer) {
        // Clear previous result
        resultContainer.innerHTML = '';
        // Add the canvas directly
        resultContainer.appendChild(canvas);
      }
    }
  
    function handleAspectChange(newAspect: number) {
      setAspect(newAspect);
      
      if (imgRef.current) {
        const { width, height } = imgRef.current;
    
        const newCrop = centerCrop(
          makeAspectCrop(
            {
              unit: '%',
              width: 90, 
            },
            newAspect,
            width,
            height
          ),
          width,
          height
        );
    
        setCrop(newCrop);
      }
    }
  
    return (
      <div className='relative bg-black rounded-lg max-w-4xl w-full max-h-[90vh] min-h-[400px] flex gap-2 animate-slideUp'>
        <button 
        className='absolute top-2 right-2'
        onClick={()=>{setImageEditWindow(false)}}
        >
        <CloseIcon 
            color='grey'
            width= {20}
            height= {20}
        />
        </button>
        <section className='p-2'>
            {imgSrc && (
            <ReactCrop 
                crop={crop || undefined} 
                onChange={c => setCrop(c)} 
                aspect={aspect}
            >
                <img 
                ref={imgRef} 
                src={imgSrc} 
                alt='Crop me' 
                onLoad={onImageLoad} 
                />
            </ReactCrop>
            )}
        </section>
        <section className='pr-2'>
            <h3 className='text-white mt-5'>Choose preset crop options</h3>
            <div className='flex gap-3 flex-wrap mt-3'>
              {PresetCropOptions.map(option=>(
                <PresetCropButton 
                  key={option.aspectRatio}
                  handleAspectChange={handleAspectChange}
                  buttonText={option.name}
                  aspectRatio={option.aspectRatio}
                  iconStyle={option.aspectRatio_style}
                />
              ))}
            </div>
            <button 
            type='button' 
            className='relative flex gap-4 justify-center items-center mt-4 text-green-100 rounded text-sm w-full overflow-hidden' 
            onClick={getCroppedImg}
            >
               <div className="absolute inset-0 rounded animated-gradient-border opacity-70"></div>

               <div className="relative flex gap-4 justify-center items-center py-2 px-2 bg-gray-800 rounded m-[1px] w-full">
                 <CropIcon size={20} />
                 <span>Crop Image</span>
              </div>
            </button>
            <div>
                <h3 className='text-white mt-6'>Result</h3>
                <div id="cropped-result-container" className="mt-2">
                 {croppedImageUrl && <img src={croppedImageUrl} alt='Cropped result' />}
                </div>
              </div>
        </section>
      </div>
    );
}

export default ImageEditWindow;