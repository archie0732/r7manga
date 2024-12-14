import { useState } from 'react';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export function SafeImage({ src = '/img/1210.png', width = 100, height = 100, alt = 'fail', className = '' }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return null;
  }

  return (
    <div className={twMerge(`relative rounded-lg ${isLoading ? 'min-h-[100px]' : ''}`, className)}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={`transition-opacity duration-300 rounded ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <div className="flex items-center justify-center">
        </div>
      )}
    </div>
  );
};
