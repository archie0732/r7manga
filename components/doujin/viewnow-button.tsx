'use client';

import { useAppStore } from '@/stores/app';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { ReadingModeSelector } from '../setting/read-mode-select';
import Link from 'next/link';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Eye } from 'lucide-react';
import { useState } from 'react';

interface ButtonProps {
  id: string;
}

export function ViewNowButtonA({ id }: ButtonProps) {
  const [showAngin, setAngin] = useState(true);
  const { readModeCheck, showreadModeCheck, readMode } = useAppStore();

  return (
    <div>
      {
        readModeCheck
          ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="aaa">
                    <Eye />
                    Read now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Reading Mode</DialogTitle>
                    <DialogDescription>if you are cellphone user, we recommend that you choose page mode</DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <ReadingModeSelector />
                  </div>
                  <div className="flex gap-1">
                    <Checkbox id="dont-show" checked={!showAngin} onCheckedChange={() => setAngin(!showAngin)} />
                    <Label htmlFor="dont-show">dont show this dialog angin</Label>
                  </div>
                  <DialogFooter>
                    <Link href={`/n/${id}/${readMode}`}>
                      <Button variant="aaa" onClick={() => showreadModeCheck(showAngin)}>
                        <Eye />
                        read now!
                      </Button>
                    </Link>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )
          : (
              <Link href={`/n/${id}/${readMode}`}>
                <Button variant="aaa">
                  <Eye />
                  Read now
                </Button>
              </Link>
            )
      }
    </div>
  );
}
