'use client';
import { useAppStore } from '@/stores/app';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export function ReadModeChackBox() {
  const { readModeCheck, showreadModeCheck } = useAppStore();
  return (
    <div className="mt-2">
      <Checkbox id="read-mode-check" checked={readModeCheck} onCheckedChange={() => showreadModeCheck()} />
      <Label
        htmlFor="read-mode-check"
        className={`
          p-2 text-sm leading-none text-gray-500
          peer-disabled:cursor-not-allowed peer-disabled:opacity-70
        `}
      >
        Alway ask me before read comic
      </Label>
    </div>
  );
}
