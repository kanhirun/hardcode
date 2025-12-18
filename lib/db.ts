// TODO: Replace me with supabase or knex
let _db: IDBDatabase | undefined;
const version = 2;

export const getDB = (): Promise<IDBDatabase> => {
  if (typeof(_db) !== 'undefined') {
    return Promise.resolve(_db);
  }

  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open("mockdb", version);

    req.onerror = (_) => {
      console.error('mockdb failed to open');
      reject(new Error('Failed to open database'));
    };

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('cards')) {
        db.createObjectStore("cards", { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('decks')) {
        db.createObjectStore("indexCards", { keyPath: 'cardId' });
      }
    }
    
    req.onsuccess = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      resolve(db);
    };
  });
};

