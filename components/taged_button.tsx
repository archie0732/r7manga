import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface Tag {
  id: number;
  type: string;
  name: string;
  url: string;
  count: number;
}

interface TagPro {
  tagged: Tag;
}

interface TagMatrixPro {
  tagged: Tag[];
}

type Props = (TagPro | TagMatrixPro) & {
  type: string;
  icon: React.ReactNode;
};

export function TagedDemo({ tagged, type, icon }: Props) {
  return (
    <div className="flex items-center mt-2 gap-2">
      {icon}
      <p className=" mr-3">
        {type}
      </p>
      {Array.isArray(tagged)
        ? (
            tagged.slice(0, 4).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
              >
                {tag.name}
              </Badge>

            ))

          )
        : (
            <Badge variant="secondary">
              {(tagged?.name) ? tagged.name : 'origin'}
            </Badge>
          )}
      {Array.isArray(tagged) && tagged.length > 4
        ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <span className="text-gray-400 font-bold bg-opacity-0 ">...Watch all</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{type}</AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-wrap gap-2">
                    {tagged.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
        : <div></div>}

    </div>
  );
}
