import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBeforePrice(currentPrice: number): number {
  const raw = currentPrice * 1.2;
  return Math.ceil(raw / 10) * 10 - 0.01;
}
