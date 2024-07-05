import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { IncomingMessage } from 'http';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})


export function buffer(readable: IncomingMessage) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    readable.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}
