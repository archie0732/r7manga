import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '../ui/button';

interface PaginPro {
  url: string;
  nowPage: number;
}

export function PaginationDemo({ url, nowPage }: PaginPro) {
  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          {nowPage == 1 ? <Button disabled variant="ghost" /> : <PaginationPrevious href={`${url}&page=${(nowPage - 1).toString()}`} />}
        </PaginationItem>
        <PaginationItem>
          {nowPage == 1 ? <Button disabled variant="ghost">0</Button> : <PaginationLink href={`${url}&page=${(nowPage - 1).toString()}`}>{(nowPage - 1).toString()}</PaginationLink>}
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`${url}&page=${(nowPage).toString()}`} isActive>
            {(nowPage).toString()}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`${url}&page=${(nowPage + 1).toString()}`}>{(nowPage + 1).toString()}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`${url}&page=${(nowPage + 1).toString()}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
