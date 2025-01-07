import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToBase64 = (
  file: File,
  isType: boolean = false
): Promise<{ isSuccess: boolean; base64String?: string; error?: any }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;

      const resultBase64 = isType ? base64String : base64String.split(',')[1];

      resolve({ isSuccess: true, base64String: resultBase64 });
    };

    reader.onerror = (error) => {
      console.error("File conversion error: ", error);
      reject({ isSuccess: false, error });
    };

    reader.readAsDataURL(file);
  });
};

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateColorFromInitial(initial: string): string {
  const asciiCode = initial.toUpperCase().charCodeAt(0);
  const hue = (asciiCode - 65) * 15;
  const saturation = 80;
  const lightness = 70;
  return hslToHex(hue, saturation, lightness);
}

