import dotenv from 'dotenv'

dotenv.config();


export const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_URL_DB: process.env.MONGO_URL_DB,
    DB_NAME: process.env.DB_NAME,
    SECRET: process.env.SECRET
};