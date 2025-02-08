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
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="general" className="space-y-5">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Wrench size={16} />
            General
          </TabsTrigger>
          <TabsTrigger value="prefer" className="flex items-center gap-2">
            <UserCog size={16} />
            Prefer
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock size={16} />
            Develop Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
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
              <div className={`
                mt-10 flex flex-wrap justify-center
                md:justify-between
              `}
              >
                <div className="flex flex-col justify-start text-left">
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

              {/** nhentai stting */}
              <div>
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span>Nhentai Image Source</span>
                    <span className="text-sm text-gray-500">if the imageloading is stuck, you can try changing it.</span>
                  </div>
                  <NURLCombobox />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>CloudFare Token</span>
                    <span className="text-sm text-gray-500">if cf block the page which want to visit, we can provide server token. but sometime will not work</span>
                  </div>
                  <Button variant="outline">get server token</Button>
                </div>
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

        <TabsContent value="prefer">
          <Card>
            <CardHeader>
              <CardTitle>Not ready</CardTitle>
              <CardDescription>not ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ban tag</Label>
                  <div className="text-sm text-gray-500">cannot use</div>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>follow favorite artist</Label>
                  <div className="text-sm text-gray-500">cannot use</div>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>prefer comic</Label>
                  <div className="text-sm text-gray-500">cannot use</div>
                </div>
                <Switch disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Developer Mode</CardTitle>
              <CardDescription>advanced options or during develop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <span className="text-lg font-bold">Developer</span>

              <div className={`
                flex items-center justify-between rounded-md border p-2
              `}
              >

                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/img/8.jpg" />
                  </Avatar>
                  <span className="text-md text-gray-500">archie0732</span>
                </div>

                <Link
                  href="https://github.com/archie0732"
                  className="flex items-end"
                >
                  <Button variant="outline">view github</Button>
                </Link>

              </div>

              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span>WebSite</span>
                  <span className="text-gray-500">source code</span>
                </div>
                <Link
                  href="https://github.com/archie0732/r7manga"
                  className={`
                    flex
                    hover:text-blue-600
                  `}
                >
                  https://github.com/archie0732/r7manga
                </Link>
              </div>

              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span>API Console</span>
                  <span className="text-gray-500">show the api log</span>
                </div>
                <div className="flex items-center">
                  <Switch disabled />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Version</Label>
                </div>
                <div className="flex justify-end">
                  <Input defaultValue="1.20.8" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>feed back</Label>
                <Input />
                <div className="flex justify-end">
                  <Button>Submit</Button>
                </div>
              </div>

              <div className="flex justify-between">
                <span>test mode</span>
                <Link href="/test">a</Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
