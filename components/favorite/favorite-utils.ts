export const buildNewestFirstFavorites = <T>(items: T[]) => [...items].reverse();

export const getNextFavoriteItem = <T extends { id: string }>(
  items: T[],
  currentId: string,
) => {
  const currentIndex = items.findIndex((item) => item.id === currentId);

  if (currentIndex === -1 || currentIndex >= items.length - 1) {
    return null;
  }

  return items[currentIndex + 1] ?? null;
};
