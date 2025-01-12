import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, UserCog, Wrench } from 'lucide-react';
import { NURLCombobox } from '@/components/setting/n-image-url-combobox';
import { ProtectModeSwitch } from '@/components/setting/protectmode-switch';
import { ProtectImageSelect } from '@/components/setting/protect-image-select';
import { ReadingModeSelector } from '@/components/setting/read-mode-select';
import { ReadModeChackBox } from '@/components/setting/readmode-checkbox';
import { ThemesSwitch } from '@/components/setting/theme-switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Wrench size={16} />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <UserCog size={16} />
            Prefer
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock size={16} />
            開發者模式
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="text-lg">
              <CardTitle>General</CardTitle>
              <CardDescription>base option settings about Website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span>Dark Mode</span>
                  <span className="text-gray-500">we have Dark and light themes you can select</span>
                </div>
                <ThemesSwitch />
              </div>
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span>Protect Mode</span>
                  <span className="text-gray-500">quicky switch sensitive image</span>
                </div>
                <ProtectModeSwitch />
              </div>

              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span>Protect Mode Image</span>
                  <span className="text-gray-500">click picture to change</span>
                </div>
                <ProtectImageSelect />
              </div>
              <div className="mt-10 flex justify-between">
                <div className="flex flex-col">
                  <span>Reading Mode</span>
                  <ReadModeChackBox />
                </div>
                <ReadingModeSelector />
              </div>

              <div className="flex justify-end">
                <Button variant="destructive">Rset All</Button>
              </div>

              <div className={`
                h-[1px] bg-slate-300
                dark:bg-gray-800
              `}
              />

              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span>Nhentai Image Source</span>
                  <span className="text-sm text-gray-500">if the imageloading is stuck, you can try changing it.</span>
                </div>
                <NURLCombobox />
              </div>

              <div className={`
                h-[1px] bg-slate-300
                dark:bg-gray-800
              `}
              />

              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-md">Terms of Service</span>
                  <span
                    className="font-bold text-md"
                  >
                    Privacy Policy
                  </span>
                  <span className="text-gray-500">By using this website, you represent and agree to our Terms of Service and Privacy Policy.</span>
                </div>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <Checkbox defaultChecked={true} disabled />
                  <span>I agree to all the terms of this website</span>
                </div>
              </div>

              <div className="flex justify-end text-center">
                <Link href="https://youtu.be/dQw4w9WgXcQ?si=RA9pUCQu7hOCiKDx">
                  <Button variant="destructive">
                    I reject
                  </Button>
                </Link>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>管理您的通知偏好</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>電子郵件通知</Label>
                  <div className="text-sm text-gray-500">接收重要更新的電子郵件</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>推送通知</Label>
                  <div className="text-sm text-gray-500">接收即時推送通知</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>每週摘要</Label>
                  <div className="text-sm text-gray-500">接收每週活動摘要</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>隱私設定</CardTitle>
              <CardDescription>管理您的隱私偏好</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>公開個人資料</Label>
                  <div className="text-sm text-gray-500">允許其他使用者查看您的個人資料</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>顯示上線狀態</Label>
                  <div className="text-sm text-gray-500">讓其他使用者看到您的上線狀態</div>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>封鎖的使用者</Label>
                <Input placeholder="搜尋使用者..." />
                <div className="mt-2 text-sm text-gray-500">
                  目前沒有封鎖任何使用者
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
