import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from './ui/button';

export function GithubButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="bg-sky-950 border-white border-solid border">關於本站</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本網站使用React & next.js </AlertDialogTitle>
          <AlertDialogDescription>
            Vue：React太強了，
            而且React還沒有使出全力的樣子，
            對方就算沒有shadcn也會贏，
            我甚至覺得有點對不起他，
            我沒能在這場戰鬥讓React展現他的全部給我，
            殺死我的不是報錯或html，
            而是比我更強的框架，真是太好了
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>關閉</AlertDialogCancel>
          <AlertDialogAction>Github</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
