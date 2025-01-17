import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '../ui/button';

interface PaginPro {
  url: string;
  nowPage: number;
  doujinCount: number;
}

export function PaginationDemo({ url, nowPage, doujinCount }: PaginPro) {
  return (

    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          {nowPage == 1 ? <Button className="hidden" /> : <PaginationPrevious href={`${url}&page=${(nowPage - 1).toString()}`} />}
        </PaginationItem>
        <PaginationItem>
          {nowPage == 1 ? <Button className="hidden" /> : <PaginationLink href={`${url}&page=${(nowPage - 1).toString()}`}>{(nowPage - 1).toString()}</PaginationLink>}
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`${url}&page=${(nowPage).toString()}`} isActive>
            {(nowPage).toString()}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          {doujinCount < 25 ? <div className="hidden" /> : <PaginationLink href={`${url}&page=${(nowPage + 1).toString()}`}>{(nowPage + 1).toString()}</PaginationLink>}
        </PaginationItem>

        <PaginationItem>
          {doujinCount < 25 ? <div className="hidden" /> : <PaginationNext href={`${url}&page=${(nowPage + 1).toString()}`} />}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
