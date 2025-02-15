'use client';

import { useState } from 'react';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Check, Loader2, X } from 'lucide-react';
import Image from 'next/image';

export function SettingCFbypassButton() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'success' | 'loading' | 'error'>('loading');

  const handleAlert = async (open: boolean) => {
    setOpen(open);

    if (open == true) {
      await cfpass();
    }
  };

  const cfpass = async () => {
    setStatus('loading');
    const res = await fetch('/api/cf', {

      method: 'POST', body: JSON.stringify({ passwd: 'yanami' }) });

    if (!res.ok) {
      setStatus('error');
      return;
    }
    setStatus('success');
  };

  const dialogContent = () => {
    if (status === 'loading') {
      return (
        <>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-1">
              <Loader2 className="h-4 w-4 animate-spin" />
              正在抓取資料
            </AlertDialogTitle>
            <AlertDialogDescription>
              資料抓取可能需要一點時間，請稍後.....
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Image src="/img/setting/loading-girl.png" alt="loding-girl" height={100} width={100} />

        </>
      );
    }
    else if (status === 'error') {
      return (
        <>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-1">
              <X />
              抓取錯誤
            </AlertDialogTitle>
            <AlertDialogDescription>
              抓取時發生錯誤，請稍後在嘗試
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Image src="/img/setting/error-miku.png" alt="error-miku" height={100} width={100} />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => void handleAlert(false)}>關閉</AlertDialogCancel>
          </AlertDialogFooter>
        </>
      );
    }
    else {
      return (
        <>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-1">
              <Check />
              抓取成功，已經將token設定完畢
            </AlertDialogTitle>
            <AlertDialogDescription>
              您現在可以關閉此頁面
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Image src="/img/setting/happy-girl.png" alt="happy-girl" height={100} width={100} />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => void handleAlert(false)}>關閉</AlertDialogCancel>
          </AlertDialogFooter>
        </>
      );
    }
  };

  return (
    <div>
      <Button variant="outline" onClick={() => { void handleAlert(true); }}>set token</Button>

      <AlertDialog open={open}>
        <AlertDialogContent>
          {dialogContent()}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
