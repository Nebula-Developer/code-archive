import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const easings: { [style: string]: string } = {
  expoOut: "cubic-bezier(0.19, 1, 0.22, 1)",
  expoIn: "cubic-bezier(0.7, 0, 0.3, 1)",
  expoInOut: "cubic-bezier(0.45, 0.05, 0.55, 0.95)",

  linear: "cubic-bezier(0, 0, 1, 1)",
};
