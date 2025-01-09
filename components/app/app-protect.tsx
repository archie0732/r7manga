'use client';
import { Toggle } from '../ui/toggle';
import { Shield, ShieldOff } from 'lucide-react';
import { useAppStore } from '@/stores/app';

export function ProtectProps() {
  const appStore = useAppStore();
  return (
    <Toggle
      pressed={appStore.protect}
      onPressedChange={appStore.toggleProtect}
      variant="outline"
      className={`
        data-[state=off]:border-red-500 data-[state=off]:text-red-500
        data-[state=on]:bg-green-500
      `}
    >
      {
        appStore.protect ? <Shield /> : <ShieldOff />
      }
    </Toggle>
  );
}
