import { Lock, UserCog, Wrench } from 'lucide-react';

import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NURLCombobox } from '@/components/setting/n-image-url-combobox';
import { OfflineMode } from '@/components/button/offline-mode';
import { ProtectImageSelect } from '@/components/setting/protect-image-select';
import { ProtectModeSwitch } from '@/components/setting/protectmode-switch';
import { ReadModeChackBox } from '@/components/setting/readmode-checkbox';
import { ReadingModeSelector } from '@/components/setting/read-mode-select';
import { SettingCFbypassButton } from '@/components/setting/cf-bypass';
import { Switch } from '@/components/ui/switch';
import { ThemesSwitch } from '@/components/setting/theme-switch';

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
          <TabsTrigger value="developer" className="flex items-center gap-2">
            <Lock size={16} />
            Develop Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8">
          <Card>
            <CardHeader className="text-lg">
              <CardTitle>General</CardTitle>
              <CardDescription>base option settings about Website</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Dark Mode</ItemTitle>
                  <ItemDescription>Switch between Light Mode and Dark Mode</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ThemesSwitch />
                </ItemActions>
              </Item>

              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Protection Mode</ItemTitle>
                  <ItemDescription>Replace sensitive image with a safer one</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ProtectModeSwitch />
                </ItemActions>
              </Item>

              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Protection Image</ItemTitle>
                  <ItemDescription>Replace sensitive image with a safer one</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ProtectImageSelect />
                </ItemActions>
              </Item>

              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Reading Direction</ItemTitle>
                  <ItemDescription>Select the reading direction</ItemDescription>
                  <ReadingModeSelector />
                  <ReadModeChackBox />
                </ItemContent>
              </Item>

              <div className="flex justify-end">
                <Button variant="destructive">Reset All</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-lg">
              <CardTitle>nHentai</CardTitle>
              <CardDescription>nHentai related settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>nHentai Image Source</ItemTitle>
                  <ItemDescription>Try to change the image source if the image is not loading</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <NURLCombobox />
                </ItemActions>
              </Item>

              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Offline Mode</ItemTitle>
                  <ItemDescription>When the website is blocked by Cloudflare, you can enable the offline mode. Note that you can only view the collected works in this mode.</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <OfflineMode />
                </ItemActions>
              </Item>

              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Cloudflare Token</ItemTitle>
                  <ItemDescription>You can only set it when the application is running locally</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <SettingCFbypassButton />
                </ItemActions>
              </Item>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Item>
                <ItemContent>
                  <ItemTitle>Terms of Service</ItemTitle>
                  <ItemDescription>By using this website, you represent and agree to our Terms of Service and Privacy Policy.</ItemDescription>
                </ItemContent>
                <ItemActions>
                  I agree to the terms of service and privacy policy
                  <Checkbox defaultChecked={true} disabled />
                </ItemActions>
              </Item>

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

        <TabsContent value="developer">
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
                  <span className="text-gray-500">archie0732</span>
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
                    hover:underline
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
                <Label>Command</Label>
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
