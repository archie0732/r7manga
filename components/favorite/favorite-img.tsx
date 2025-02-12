'use client';

import { useAppStore } from '@/stores/app';
import Image from 'next/image';

interface ImageURLProps {
  url: string;
  alt: string;
}

export function FavoriteImage({ url, alt }: ImageURLProps) {
  const { protect, nhentaiImageURL, protectImage } = useAppStore();

  return (
    <div>

      {
        protect
          ? <Image src={protectImage} height={alt === 'cover' ? 300 : 800} width={alt === 'cover' ? 300 : 800} alt="protect" />
          : <Image src={alt === 'cover' ? url : nhentaiImageURL + url} alt={alt} height={alt === 'cover' ? 300 : 800} width={alt === 'cover' ? 300 : 800} title={alt === 'cover' ? url : nhentaiImageURL + url} />
      }
    </div>
  );
}
