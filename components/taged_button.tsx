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
import Image from 'next/image';

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
  icon: string;
};

export function TagedDemo({ tagged, type, icon }: Props) {
  return (
    <div className="flex items-center mt-2">
      <Image
        src={icon}
        width={15}
        height={15}
        alt="tagged"
        className="invert mr-1"
      />
      <p className="text-white mr-3">
        {type}
        :
      </p>
      {Array.isArray(tagged)
        ? (
            tagged.slice(0, 4).map((tag) => (
              <button
                key={tag.id}
                className="text-gray-400 font-bold bg-gray-700 hover:text-white rounded-xl mr-2 p-1"
              >
                {tag.name}
              </button>

            ))

          )
        : (
            <button className="text-gray-400 font-bold bg-opacity-0 hover:text-white">
              {tagged.name }
            </button>
          )}
      {Array.isArray(tagged) && tagged.length > 4
        ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-gray-400 font-bold bg-opacity-0 hover:text-white">...Watch all</button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-900">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">{type}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {tagged.map((tag) => (
                      <button
                        key={tag.id}
                        className="text-gray-400 font-bold bg-gray-700 hover:text-white rounded-xl mr-2 p-1 mt-2"
                      >
                        {tag.name}
                      </button>
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
