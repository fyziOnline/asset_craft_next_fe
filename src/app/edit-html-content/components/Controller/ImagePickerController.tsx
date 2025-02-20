// ImagePickerController.tsx
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps } from '@jsonforms/core';
import { ImagePicker } from './ImagePicker';

const ImagePickerControl = ({
  data,
  handleChange,
  path,
  label,
  required
}: ControlProps) => (
   <ImagePicker
    value={data || ''}
    onChange={(newValue: string ) => handleChange(path, newValue)}
    label={`${label}${required ? ' *' : ''}`}
  />
);

export const ImagePickerController = withJsonFormsControlProps(ImagePickerControl);