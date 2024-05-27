import { config as Config } from "dotenv";

Config();

const _config = {
    port: process.env.PORT,
    databaseurl: process.env.MONGO_CONNECTION_URL,
    env: process.env.NODE_ENV,
};

export const config = Object.freeze(_config);
