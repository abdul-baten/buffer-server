import * as dotenv from 'dotenv';
dotenv.config();

export const configuration = require(`./env/${process.env.NODE_ENV ?? 'development'}`) || {};

export const defaultConfig = () => ({ ...configuration.default });
