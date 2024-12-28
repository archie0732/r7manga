import { TagData } from '@/app/api/nhentai/[doujin]/route';
import { Badge } from '@/components/ui/badge';

import Row from './layout/row';
import Link from 'next/link';

type Props = Readonly<{
  tag: TagData[];
  label: string;
  icon: React.ReactNode;
}>;

export function TagedDemo({ tag, label, icon }: Props) {
  return (
    <div className="flex gap-2">
      <Row className="gap-2">
        {icon}
        <span>{label}</span>
      </Row>
      <div className="flex flex-wrap gap-2">
        {
          tag.map((tag) => (
            <Link
              key={tag.id}
              href={`/search?${tag.type}=${tag.name}`}
            >
              <Badge variant="secondary">
                {tag.name}
              </Badge>
            </Link>
          ))
        }
      </div>
    </div>
  );
}
