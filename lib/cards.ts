import { getDB } from './db';
import * as z from 'zod';

export const CardSchema = z.object({
  id: z.number(),
  type: z.enum(['flashcard', 'taskcard']),
  front: z.string(), 
  back: z.string(),
})

export type Card = z.infer<typeof CardSchema>;
export type CreateCardProps = Card;

export const createCard = async (props: Partial<CreateCardProps>): Promise<void>  => {
  const data = CardSchema.parse(props);

  const db = await getDB();
  const cardObjectStore = db.transaction('cards', 'readwrite').objectStore('cards');

  const req = cardObjectStore.add(data);

  return new Promise((resolve, reject) => {
    req.onerror   = (_) => reject(new Error('Failed to create card'));
    req.onsuccess = (e) => resolve();
  });
}
