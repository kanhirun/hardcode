import { getDB } from '@/lib/db';
import type { AnyCard } from '@/lib/models/cards';

export type Deck = {
  cards: AnyCard[];
}

export const createDeck = async (): Promise<Deck> => {
  const db = await getDB();
  const cardObjectStore = db.transaction('cards', 'readonly').objectStore('cards');

  const req = cardObjectStore.getAll();

  return new Promise((resolve, reject) => {
    req.onerror = (_) => reject(new Error('Failed to get cards'));
    req.onsuccess = (e) => {
      const cards = (e.target as IDBRequest).result || [];
      resolve({ cards });
    }
  });
}
