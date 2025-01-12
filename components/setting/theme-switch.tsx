'use client';
import { useTheme } from 'next-themes';
import { Switch } from '../ui/switch';
import { useEffect, useState } from 'react';

export function ThemesSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return false;
  }

  const changeMode = () => {
    if (theme === 'light') {
      setTheme('dark');
    }
    else {
      setTheme('light');
    }
  };
  return (<Switch checked={theme === 'dark'} onCheckedChange={changeMode} />);
}
