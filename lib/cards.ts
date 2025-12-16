import { getDB } from './db';
import * as z from 'zod';

export const BaseSchema = z.object({
  id: z.number(),
  type: z.enum(['flash', 'task']),
})

const FlashSchema = BaseSchema.extend({
  type: z.literal('flash'),
  front: z.string(), 
  back: z.string(),
})

// TODO: Consider adding `snapshotPath` as an alternative arg to `files`
const TaskSchema = BaseSchema.extend({
  type: z.literal('task'),
  files: z.record(z.string(), z.object({
    file: z.object({
      contents: z.string()
    })
  })),
});

const CardSchema = z.union([FlashSchema, TaskSchema]);

export type Flash = z.infer<typeof FlashSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Card = z.infer<typeof CardSchema>;

// ---

export const CreateCardSchema = z.union([
  FlashSchema.extend({ id: z.number().optional() }),
  TaskSchema.extend({ id: z.number().optional() }),
]);

export type CreateCard = z.infer<typeof CreateCardSchema>;

export const createCard = async (props: Partial<CreateCard>): Promise<void>  => {
  const data = CreateCardSchema.parse(props);

  const db = await getDB();
  const cardObjectStore = db.transaction('cards', 'readwrite').objectStore('cards');

  const req = cardObjectStore.add(data);

  return new Promise((resolve, reject) => {
    req.onerror   = (_) => reject(new Error('Failed to create card'));
    req.onsuccess = (e) => resolve();
  });
}
