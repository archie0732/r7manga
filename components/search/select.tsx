import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="ml-5 mt-1 w-[180px]">
        <SelectValue placeholder="Search Website" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Website</SelectLabel>
          <SelectItem value="nhentai">nhentai</SelectItem>
          <SelectItem value="ehentai">ehentai</SelectItem>
          <SelectItem value="dlsite">dlsite</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
