import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SelectSort = React.forwardRef<
  React.ComponentRef<typeof Select>,
  React.ComponentPropsWithoutRef<typeof Select>
>((props, ref) => {
  void ref;
  return (
    <Select {...props}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Recent</SelectItem>
        <SelectItem value="popular-today">Popular Now</SelectItem>
        <SelectItem value="popular-week">Popular Week</SelectItem>
      </SelectContent>
    </Select>
  );
});
