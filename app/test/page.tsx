'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/hooks/use-toast';

export default function Page() {
  const { toast } = useToast();
  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => {
        toast({
          description: 'aaaaaaaaa',
        });
      }}
      >
        aaa
      </Button>
    </div>
  );
}
