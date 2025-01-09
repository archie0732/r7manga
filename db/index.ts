import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import 'dotenv/config';

export const db = drizzle(process.env.DATABASE_URL ?? '', { schema });
