import { getDB } from './db';

export type Card = {
  front: string;
  back: string;
}

export type CreateCardProps = Card;

export const createCard = async (props: CreateCardProps): Promise<void>  => {
  const db = await getDB();
  const cardObjectStore = db.transaction('cards', 'readwrite').objectStore('cards');

  const req = cardObjectStore.add(props);

  return new Promise((resolve, reject) => {
    req.onerror   = (_) => reject(new Error('Failed to create card'));
    req.onsuccess = (e) => resolve();
  });
}
