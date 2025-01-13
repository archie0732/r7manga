'use client';

import { ReadMode, useAppStore } from '@/stores/app';
import Image from 'next/image';

export function ReadingModeSelector() {
  const { readMode, setReadMode } = useAppStore();
  const modes: {
    id: ReadMode;
    label: string;
    description: string;
    image: string;
  }[] = [
    {
      id: 'scroll',
      label: 'Scroll Reading',
      description: 'vertical scroll reading mode',
      image: '/img/setting/scroll.png',
    },
    {
      id: 'pagination',
      label: 'Paged Reading',
      description: 'single-page flip reading mode, better in cellphone if feel lag',
      image: '/img/setting/pagination.png',
    },
  ];

  return (
    <div className="flex gap-4">
      {modes.map((mode) => (
        <div
          key={mode.id}
          className={`
            group relative flex w-48 cursor-pointer flex-col items-center
            rounded-xl border-2 bg-slate-300 p-6 transition-all duration-200
            dark:bg-gray-700
            hover:shadow-lg
            ${readMode === mode.id
          ? 'border-blue-500 shadow-md'
          : `
            border-gray-200
            hover:border-gray-300
          `
        }
          `}
          onClick={() => setReadMode(mode.id)}
        >
          <div className="relative mb-4 overflow-hidden rounded-lg">
            <Image
              src={mode.image}
              width={80}
              height={120}
              alt={`${mode.id}-mode`}
              className={`
                transform transition-transform duration-200
                group-hover:scale-105
              `}
            />
          </div>

          <h3 className={`
            mb-1 font-medium
            ${readMode === mode.id ? 'text-blue-600' : 'text-gray-900'}
          `}
          >
            {mode.label}
          </h3>

          <p className="text-center text-sm text-gray-500">
            {mode.description}
          </p>

          {readMode === mode.id && (
            <div className={`
              absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center
              rounded-full bg-blue-500 text-white
            `}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                strokeWidth="2.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
