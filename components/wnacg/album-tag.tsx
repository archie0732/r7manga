import { Badge } from '@/components/ui/badge';

import Row from '../layout/row';

type Props = Readonly<{
  tag: string[];
  label: string;
  icon: React.ReactNode;
}>;

export function AlbumTaged({ tag, label, icon }: Props) {
  return (
    <div className="flex gap-2">
      <Row className="gap-2">
        {icon}
        <span>{label}</span>
      </Row>
      <div className="flex flex-wrap gap-2">
        {
          tag.map((t, i) => (
            /* TO DO add link */
            <Badge variant="secondary" key={i}>
              {t}
            </Badge>

          ))
        }
      </div>
    </div>
  );
}
