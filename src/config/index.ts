import * as dotenv from 'dotenv';
dotenv.config();

const configuration =
  require(`./env/${process.env.NODE_ENV ?? 'development'}`) || {};

const defaultConfig = () => ({ ...configuration.default });

export { configuration, defaultConfig };
