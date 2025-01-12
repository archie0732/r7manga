'use client';
import { useAppStore } from '@/stores/app';
import { Switch } from '../ui/switch';

export function ProtectModeSwitch() {
  const { protect, toggleProtect } = useAppStore();
  return (
    <div className="items-end">
      <Switch checked={protect} onClick={() => toggleProtect()} />
    </div>
  );
}
