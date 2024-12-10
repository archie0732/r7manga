import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SelectSort() {
  return (
    <Select>
      <SelectTrigger className="w-[180px] bg-white select-none">
        <SelectValue placeholder="sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>sort</SelectLabel>
          <SelectItem value="Recent">Recent</SelectItem>
          <SelectItem value="PopularNow">Popular Now</SelectItem>
          <SelectItem value="PopularWeek">Popular Week</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
