import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Page() {
  return (
    <div className="flex-col flex justify-center">
      <div className="flex justify-center">
        <Select>
          <SelectTrigger className="w-[180px] mt-1 ml-5">
            <SelectValue placeholder="Search Website" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Website</SelectLabel>
              <SelectItem value="apple">nhentai</SelectItem>
              <SelectItem value="dlsite">dlsite</SelectItem>
              <SelectItem value="hanime">hanime1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
