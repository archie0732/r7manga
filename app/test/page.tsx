'use client';

import { Button } from '@/components/ui/button';
import { openNhentaiAndGetCfClearance } from '@/lib/utils';

import { useAppStore } from '@/stores/app';

export default function Page() {
  const { setKindKey, setOffline } = useAppStore();

  const test = async () => {
    const res = await fetch('/api/favorite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      type: 'artist',
      artist: 'yanami anna',
    }) });

    if (!res.ok) {
      alert('!ok');
    }
    else {
      alert('ok');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex gap-2">
        <Button onClick={() => void test()}>test</Button>
        <Button onClick={() => setKindKey('yanami_anna')}>set key</Button>
        <Button onClick={() => setKindKey('')}>clear key</Button>
        <Button onClick={() => openNhentaiAndGetCfClearance()} />
        <Button onClick={() => setOffline()}>offline</Button>
      </div>
    </div>
  );
}
