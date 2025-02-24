// ImagePickerController.tsx
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps } from '@jsonforms/core';
import { ImagePicker } from './ImagePicker';

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
   <ImagePicker
    value={data || ''}
    onChange={(newValue: string ) => handleChange(path, newValue)}
    label={`${label}${required ? ' *' : ''}`}
    uischema={uischema}
  />
);

export const ImagePickerController = withJsonFormsControlProps(ImagePickerControl);