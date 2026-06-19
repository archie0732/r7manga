import { Badge } from '@/components/ui/badge';

import Row from './layout/row';
import Link from 'next/link';

export interface LinkTagData {
  id: number | string | null;
  name: string;
  url: string;
}

type Props = Readonly<{
  tag: LinkTagData[];
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
              key={`${tag.id ?? tag.name}-${tag.name}`}
              href={tag.url}
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
