import { getDB } from './db';
import * as z from 'zod';

export enum CardType {
  Flash,
  Task,
}

export const CardTypeEnum = z.enum(CardType);

export const BaseSchema = z.object({
  id: z.number(),
  type: CardTypeEnum,
})

const FlashSchema = BaseSchema.extend({
  type: z.literal(CardType.Flash),
  front: z.string(), 
  back: z.string(),
})

const FileSchema = z.record(
  z.string(),
  z.object({
    file: z.object({
      contents: z.string()
    })
  })
);

// TODO: Consider adding `snapshotPath` as an alternative arg to `files`
const TaskSchema = BaseSchema.extend({
  type: z.literal(CardType.Task),
  files: FileSchema
});

const CardSchema = z.union([FlashSchema, TaskSchema]);

export type File = z.infer<typeof FileSchema>;
export type Flash = z.infer<typeof FlashSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Card = z.infer<typeof CardSchema>;

export const CreateFlashSchema = FlashSchema.partial({ id: true });
export const CreateTaskSchema = TaskSchema.partial({ id: true });
export const CreateCardSchema = z.union([CreateFlashSchema, CreateTaskSchema]);

export const UpdateFlashSchema = FlashSchema.partial({
  front: true,
  back: true,
});
export const UpdateTaskSchema = TaskSchema.partial({
  files: true,
});
export const UpdateCardSchema = z.union([UpdateFlashSchema, UpdateTaskSchema]);

export type CreateFlash = z.infer<typeof CreateFlashSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type CreateCard = z.infer<typeof CreateCardSchema>;
export type UpdateCard = z.infer<typeof UpdateCardSchema>;
export type UpdateFlash = z.infer<typeof UpdateFlashSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;

export const createCard = async (props: Partial<CreateCard>): Promise<void>  => {
  const db = await getDB();
  const cardObjectStore = db.transaction('cards', 'readwrite').objectStore('cards');

  if (props.id) {
    const data = UpdateCardSchema.parse(props);
    const req = cardObjectStore.put(data);
    return new Promise((resolve, reject) => {
      req.onerror   = (e) => reject(e);
      req.onsuccess = (e) => resolve();
    });
  }
  const data = CreateCardSchema.parse(props);
  const req = cardObjectStore.add(data);

  return new Promise((resolve, reject) => {
    req.onerror   = (e) => reject(e);
    req.onsuccess = (e) => resolve();
  });
}
