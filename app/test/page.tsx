'use client';

import { Button } from '@/components/ui/button';
import type { Favorite } from '../api/favorite/route';
import { useAppStore } from '@/stores/app';

export default function Page() {
  const { setKindKey } = useAppStore();

  const test = async () => {
    const res = await fetch('/api/favorite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      type: 'artist',
      artist: 'yanami anna',
    } as Favorite) });

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
      </div>
    </div>
  );
}
