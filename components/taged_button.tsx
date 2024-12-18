import { TagData } from '@/app/api/nhentai/[doujin]/route';
import { Badge } from '@/components/ui/badge';
import Row from './layout/row';

type Props = Readonly<{
  tag: TagData[];
  type: string;
  icon: React.ReactNode;
}>;

export function TagedDemo({ tag, type, icon }: Props) {
  return (
    <div className="flex gap-2">
      <Row className="gap-2">
        {icon}
        <span>{type}</span>
      </Row>
      <div className="flex flex-wrap gap-2">
        {
          tag.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
            >
              {tag.name}
            </Badge>
          ))
        }
      </div>
    </div>
  );
}
