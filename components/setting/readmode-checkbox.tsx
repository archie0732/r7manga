'use client';
import { useAppStore } from '@/stores/app';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export function ReadModeChackBox() {
  const { readModeCheck, showreadModeCheck } = useAppStore();
  return (
    <div className="my-2 flex items-center gap-2">
      <Checkbox id="read-mode-check" checked={readModeCheck} onCheckedChange={() => showreadModeCheck()} />
      <Label
        htmlFor="read-mode-check"
        className={`
          text-sm text-gray-500
          peer-disabled:cursor-not-allowed peer-disabled:opacity-70
        `}
      >
        Always ask me before reading comics
      </Label>
    </div>
  );
}
