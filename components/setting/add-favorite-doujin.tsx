'use client';
import { useState, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { useToast } from '../ui/hooks/use-toast';
import { FavoriteAdd } from '@/app/api/favorite/_model/apitype';
import { Plus } from 'lucide-react';

export function AddFavoriteButton() {
  const { toast } = useToast();
  const [form, setForm] = useState({ title: '', id: '', cover: '', page: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddFavorite = async () => {
    if (!form.title || !form.id || !form.cover || !form.page) {
      toast({
        title: '缺少必要資料',
        description: '輸入不可為空',
        variant: 'destructive',
      });
      return;
    }

    const resp = await fetch('/api/favorite', { method: 'POST', body: JSON.stringify({ type: 'doujin', doujin: { id: form.id, thumbnail: form.cover, lang: 'zh', title: form.title } } as FavoriteAdd) });

    if (!resp.ok) {
      toast({
        title: '發生錯誤',
        description: '嘗試更新 api時發生錯誤',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '添加成功',
      description: `title: ${form.title} cover: ${form.cover} id: ${form.id} page: ${form.id}`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon"><Plus /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Favorite Doujin</DialogTitle>
          <DialogDescription>Enter the doujin details and add to favorites</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="id">ID</Label>
            <Input id="id" name="id" value={form.id} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="cover">Cover URL</Label>
            <Input id="cover" name="cover" value={form.cover} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="page">Pages</Label>
            <Input id="page" name="page" type="number" value={form.page} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          <div>
            <DialogClose asChild>
              <Button
                onClick={() => void handleAddFavorite()}
                className="w-full"
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
