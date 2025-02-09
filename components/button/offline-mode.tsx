'use client';

import { useAppStore } from '@/stores/app';
import { Button } from '../ui/button';

export function OfflineMode() {
  const { offline, setOffline } = useAppStore();
  return (
    <div>
      {
        offline
          ? <Button onClick={() => { setOffline(); }} variant="outline">切換至線上模式</Button>
          : <Button onClick={() => { setOffline(); }} variant="outline">切換至離線模式</Button>
      }
    </div>
  );
}
