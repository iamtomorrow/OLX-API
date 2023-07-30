import dotenv from 'dotenv';

dotenv.config( );

export const SERVER_PORT = process.env.PORT;
export const BASE_URL = process.env.BASE_URL
export const MONGODB_DATABASE_URL = process.env.MONGO_DB_DATABASE_PORT