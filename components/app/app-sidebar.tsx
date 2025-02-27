import { Home, BookHeart, Search, Settings, PenTool, Heart, UserCheck, BadgeInfo } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Nhentai',
    url: '/n',
    icon: BookHeart,
  },
  {
    title: 'Wnacg',
    url: '/w',
    icon: PenTool,
  },
  {
    title: 'Search',
    url: '/search?q=*',
    icon: Search,
  },
  {
    title: 'Favorites',
    url: '/favorite',
    icon: Heart,

  },
  {
    title: 'Subscription',
    url: '/subscription',
    icon: UserCheck,
  },
  {
    title: 'Settings',
    url: '/setting',
    icon: Settings,
  },
  {
    title: 'About',
    url: '/about',
    icon: BadgeInfo,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Archie Manga</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
