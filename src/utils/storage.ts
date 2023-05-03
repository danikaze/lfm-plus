import { openDB } from 'idb';
import { StorageData } from './lfm/storage';

type StoredData<D> = {
  d: D;
  t?: number;
};

type DB = {
  CACHE_STORE_NAME: {
    [K in keyof StorageData]: StoredData<StorageData[K]>;
  };
};

const DB_VERSION = 1;
const CACHE_STORE_NAME = 'cache';
const dbPromise = (async () =>
  await openDB<DB>('lfm-plus', DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(CACHE_STORE_NAME);
    },
  }))();

/**
 * Set data in LOCAL storage
 */
export async function storeLocal<D>(
  key: string,
  data: D,
  ttl?: number
): Promise<void> {
  const dataToStore: StoredData<D> = { d: data };
  if (ttl) {
    dataToStore.t = Date.now() + ttl;
  }

  const db = await dbPromise;
  await db.put(CACHE_STORE_NAME, dataToStore, key);
}

/**
 * Load data from LOCAL storage
 */
export async function loadLocal<D>(
  key: string,
  defaultData?: D
): Promise<D | undefined> {
  const db = await dbPromise;
  const storedData = await db.get(CACHE_STORE_NAME, key);

  if (!storedData || (storedData.t && Date.now() > storedData.t)) {
    return defaultData;
  }
  return storedData.d;
}
