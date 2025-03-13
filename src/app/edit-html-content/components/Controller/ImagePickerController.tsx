// ImagePickerController.tsx
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps } from '@jsonforms/core';
import { ImagePicker } from './ImagePicker';
// import { ImageControllerProvider } from './context/ImageControllerContext';

// interface CustomControlProps extends ControlProps {
//   uischema :
// }

const ImagePickerControl = ({
  data,
  handleChange,
  path,
  label,
  uischema,
  required
}: ControlProps) => (
  // <ImageControllerProvider>
    <ImagePicker
     value={data || ''}
     onChange={(newValue: string ) => handleChange(path, newValue)}
     label={`${label}${required ? ' *' : ''}`}
     uischema={uischema}
   />
  // </ImageControllerProvider>
);

export const ImagePickerController = withJsonFormsControlProps(ImagePickerControl);