import { APIDoujinTagData } from '@/app/api/nhentai/_model/apitypes';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkKey = async (key: string) => {
  console.log(`rescive key: ${key}`);
  const res = await fetch('/api/keyCheck', { method: 'POST', headers: {
    'Content-Type': 'application/json',
  }, body: JSON.stringify({ message: key }) });
  return res.ok;
};

export const langFilter = (lang: APIDoujinTagData[]) => {
  if (lang.some((a) => a.name === 'japanese')) {
    return 'ja';
  }
  else if (lang.some((a) => a.name === 'chinese')) {
    return 'zh';
  }
  else {
    return 'en';
  }
};
