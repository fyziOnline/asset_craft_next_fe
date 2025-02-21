import { rankWith, or, formatIs, optionIs, RankedTester } from '@jsonforms/core';

export const ImagePickerTester: RankedTester = rankWith(
  5,
  or(
    formatIs('imageUrl'), formatIs('imageurl'),
    // You can also check for a custom option in uiSchema
    optionIs('widget', 'imagePicker'), optionIs('widget', 'imagepicker'),
  )
);