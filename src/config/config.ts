import { config as Config } from "dotenv";

Config();

const _config = {
    port: process.env.PORT,
    databaseurl: process.env.MONGO_CONNECTION_URL,
    env: process.env.NODE_ENV,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
};

export const config = Object.freeze(_config);
