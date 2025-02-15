import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function Page() {
  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle className="text-xl">關於網站</CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-4 p-7">
        <div className="flex justify-between">
          <span className="font-bold">網站名稱</span>
          <span className="text-gray-500">r7manga</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">網站網址</span>
          <Link
            href="https://r7manga.vercel.app"
            className={`
              text-gray-500
              hover:underline
            `}
          >
            r7manga.vercel.app
          </Link>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">網頁版本</span>
          <Button disabled variant="outline">1.20.8</Button>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">最後更新時間</span>
          <span className="text-gray-500">2025-02-15</span>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">開源網址</span>
          <Link
            href="https://github.com/archie0732/r7manga"
            className={`
              text-gray-500
              hover:underline
            `}
          >
            Github
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-bold">開發者列表</span>
          <div className="flex justify-between rounded-md border p-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/img/8.jpg" />
              </Avatar>
              <span className="text-md text-gray-500">archie0732</span>
            </div>

            <Link
              href="https://github.com/archie0732"
              target="_blank"
              className={`
                rounded-md border p-2
                hover:underline
              `}
            >
              github
            </Link>
          </div>
        </div>

        <div className="flex justify-between">
          <h2 className="font-bold">開發工具</h2>
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">展開</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="https://nextjs.org/" className="hover:underline" target="_blank">next.js</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="https://bun.sh/" className="hover:underline" target="_blank">Bun</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="https://ui.shadcn.com/"
                    className="hover:underline"
                    target="_blank"
                  >
                    shadcn
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="https://lucide.dev/" className="hover:underline" target="_blank">lucide</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        <div className="mt-2 border" />

        <h2 className="text-xl font-bold">API</h2>

        <div className="flex justify-between">
          <span className="font-bold">資料來源網站</span>
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">展開</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="https://nhentai.net" className="hover:underline" target="_blank">nhentai.net</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="https://wnacg.com/" className="hover:underline" target="_blank">wnacg.com</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">圖片來源</span>
          <span className="text-gray-500">漫畫圖片來源api網站，而其他圖片皆取材自網路</span>
        </div>

        <span className="font-bold">來源使用說明</span>
        <div className="rounded-lg border p-2 text-gray-500">
          <span>本網站僅供學術研究與娛樂分享之用，所有圖片資源均來源於網路。本站程式碼已開源，且無任何商業廣告，嚴禁用於商業用途。如有侵權問題，請聯繫開發者，我們將立即處理並移除相關內容。</span>
          <div className="m-2 border" />
          <span>This website is intended solely for academic research and entertainment purposes. All images are sourced from the internet. The code is open-source and free of advertisements, and commercial use is strictly prohibited. If you believe any content infringes your rights, please contact the developer, and we will promptly remove the offending material.</span>
          <div className="m-2 border" />
          <span>本サイトは学術研究および娯楽目的のみを目的としています。掲載されている画像はすべてインターネットから取得されたものです。コードはオープンソースであり、広告は一切含まれておらず、商業利用は禁止されています。万が一、権利侵害がある場合は、開発者までご連絡ください。速やかに該当コンテンツを削除いたします。</span>
        </div>
      </div>

    </Card>
  );
}
