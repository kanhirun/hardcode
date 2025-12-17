import { getDB } from './db';
import * as z from 'zod';

export enum CardType {
  Flash,
  Task,
}
export const CardTypeEnum = z.enum(CardType);
export const CardBaseSchema = z.object({
  id: z.number(),
  type: CardTypeEnum,
});

const FileContentsSchema = z.object({
  file: z.object({
    contents: z.string()
  })
});

const FlashSchema = CardBaseSchema.extend({
  type: z.literal(CardType.Flash),
  files: z.object({
    "front.md": FileContentsSchema,
    "back.md": FileContentsSchema
  }).catchall(FileContentsSchema)
})

// TODO: Consider adding `snapshotPath` as an alternative arg to `files`
const TaskSchema = CardBaseSchema.extend({
  type: z.literal(CardType.Task),
  files: z.object({
    "index.md": FileContentsSchema,
    "template.js": FileContentsSchema,
    "test.js": FileContentsSchema,
  }).catchall(FileContentsSchema)
});

// TODO: Rename to AnyCardSchema
const CardSchema = z.union([FlashSchema, TaskSchema]);

export type File = z.infer<typeof FileContentsSchema>;
export type Flash = z.infer<typeof FlashSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Card = z.infer<typeof CardSchema>;

export const CreateFlashSchema = FlashSchema.partial({ id: true });
export const CreateTaskSchema = TaskSchema.partial({ id: true });
export const CreateCardSchema = z.union([CreateFlashSchema, CreateTaskSchema]);

export const UpdateFlashSchema = FlashSchema.extend({
  files: FlashSchema.shape.files.partial({
    "front.md": true,
    "back.md": true,
  })
});
export const UpdateTaskSchema = TaskSchema.extend({
  files: TaskSchema.shape.files.partial({
    "index.md": true,
    "template.js": true,
    "test.js": true,
  })
});
export const UpdateCardSchema = z.union([UpdateFlashSchema, UpdateTaskSchema]);

export type CreateFlash = z.infer<typeof CreateFlashSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type CreateCard = z.infer<typeof CreateCardSchema>;
export type UpdateCard = z.infer<typeof UpdateCardSchema>;
export type UpdateFlash = z.infer<typeof UpdateFlashSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;

export const getFileContents = (filename: string, card: CreateCard | UpdateCard) => {
  const meta = card.files[filename];
  return meta && meta.file.contents;
}

export const createCard = async (props: CreateCard | UpdateCard): Promise<void>  => {
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
