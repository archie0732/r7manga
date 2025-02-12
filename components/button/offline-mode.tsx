'use client';

import { useAppStore } from '@/stores/app';
import { Button } from '../ui/button';

export function OfflineMode() {
  const { offline, setOffline } = useAppStore();
  return (
    <div>
      {
        offline
          ? <Button onClick={() => { setOffline(); }} variant="outline">關閉 cf bypass 模式</Button>
          : <Button onClick={() => { setOffline(); }} variant="outline">開啟 cf bypass 模式</Button>
      }
    </div>
  );
}
