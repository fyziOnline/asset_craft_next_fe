import { rankWith, scopeEndsWith, RankedTester } from '@jsonforms/core';

export const ImagePickerTester: RankedTester = rankWith(
  5,
  scopeEndsWith("image_url")
);