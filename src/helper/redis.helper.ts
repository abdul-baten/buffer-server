import to from 'await-to-js';
import { CommonUtil } from '@utils';
import { Injectable } from '@nestjs/common';
import type { RedisService } from 'nestjs-redis';

@Injectable()
export class RedisHelperService {
  public async getData (redis_client: RedisService, key: string): Promise<string | null> {
    const redis_key_exists = await redis_client.getClient().exists(key);

    if (redis_key_exists) {
      return null;
    }

    const response = await redis_client.getClient().get(key);

    return response;
  }

  public async setData (redis_client: RedisService, key: string, value: string): Promise<void> {
    await redis_client.getClient().set(key, value);
  }

  public async setDataList (redis_client: RedisService, key: string, entries: any[]): Promise<void> {
    const entries_lists = [];
    const entries_length = entries.length;
    const stringify = CommonUtil.stringifyJson();

    for (let index = 0; index < entries_length; index += 1) {
      entries_lists.push(stringify(entries[index]));
    }

    const entries_to_store = await Promise.all(entries_lists);

    if (entries_to_store.length) {
      const [error] = await to(redis_client.getClient().rpush(key, entries_to_store));

      if (error) {
        throw new Error(error.message);
      }
    }
  }

  public async getDataList (redis_client: RedisService, key: string): Promise<string[]> {
    // eslint-disable-next-line no-magic-numbers
    const [error, list] = await to(redis_client.getClient().lrange(key, 0, -1));

    if (error) {
      throw new Error(error.message);
    }

    return list as string[];
  }

  public async deleteItemFromList (redis_client: RedisService, key: string, entry: string): Promise<number> {
    const [error, count] = await to(redis_client.getClient().lrem(key, 1, entry));

    if (error) {
      throw new Error(error.message);
    }

    return count as number;
  }
}
