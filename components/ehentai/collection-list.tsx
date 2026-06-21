import Link from 'next/link';

import type { EhentaiCollection } from '@/app/api/favorite/_model/apitype';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Props = Readonly<{
  collections: EhentaiCollection[];
}>;

export function CollectionList({ collections }: Props) {
  if (collections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>No collections yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Collections</h2>
        <p className="text-sm text-muted-foreground">Open a collection to rename, reorder, or start reading.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader>
              <CardTitle>{collection.name}</CardTitle>
              <CardDescription>{`${collection.items.length.toString()} works`}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {collection.items.slice(0, 3).map((item) => (
                <div key={item.id} className="truncate">{item.title}</div>
              ))}
            </CardContent>
            <CardFooter className="gap-2">
              <Button asChild variant="secondary">
                <Link href={`/e/collections/${collection.id}`}>Manage</Link>
              </Button>
              <Button asChild>
                <Link href={`/e/collections/${collection.id}/read`}>Read</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
