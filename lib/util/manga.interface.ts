import { z } from 'zod';

const Manga = z.object({
  title: z.string(),
  id: z.string(),
  cover: z.string(),
  lang: z.string(),
});

type Manga = z.infer<typeof Manga>;

export default Manga;
