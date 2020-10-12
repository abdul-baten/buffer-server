import { config } from 'dotenv';
config({ debug: true });

export const configuration = import(`./env/${process.env.NODE_ENV}`);
export const default_config = async (): Promise<void> => ({ ...(await configuration).default });
