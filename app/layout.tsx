import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/app-sidebar';
import { AppHeader } from '@/components/app/app-header';

import localFont from 'next/font/local';
import './globals.css';

import type { Metadata } from 'next';
import AppFooter from '@/components/app/app-footer';
import AppCommand from '@/components/app/app-command';
import { Toaster } from '@/components/ui/toaster';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'R7 Manga',
  icons: '/img/1210.png',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          select-none antialiased
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className="flex w-svw flex-1 flex-col">
              <div className="flex min-h-svh flex-col">
                <AppHeader />
                {children}
                <Toaster />
              </div>
              <AppFooter />
            </div>
            <AppCommand />
          </SidebarProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}
