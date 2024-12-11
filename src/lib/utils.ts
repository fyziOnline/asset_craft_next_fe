import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToBase64 = (file: File): Promise<{ isSuccess: boolean, base64String?: string, error?: any }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve({ isSuccess: true, base64String });
    };

    reader.onerror = (error) => {
      console.error("File conversion error: ", error);
      reject({ isSuccess: false, error });
    };

    reader.readAsDataURL(file);
  });
};

