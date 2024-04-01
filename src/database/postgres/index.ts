import { Pool } from 'pg';
import config from '@/config/env';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
	connectionString: config.DATABASE_URL
});

const database = drizzle(pool);

export default database;