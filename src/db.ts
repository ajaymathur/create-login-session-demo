import { Pool } from 'pg';

export const pool = new Pool({
    host: 'localhost',
    database: "youtube_session"
});
