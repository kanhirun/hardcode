import { getDB } from './db';
import * as z from 'zod';

export enum CardType {
  Flash,
  Task,
}
export const CardTypeEnum = z.enum(CardType);
export const CardSchema = z.object({
  id: z.number(),
  type: CardTypeEnum,
});

const FileContentsSchema = z.object({
  file: z.object({
    contents: z.string()
  })
});

const FlashCardSchema = CardSchema.extend({
  type: z.literal(CardType.Flash),
  files: z.object({
    "front.md": FileContentsSchema,
    "back.md": FileContentsSchema
  }).catchall(FileContentsSchema)
})

// TODO: Consider adding `snapshotPath` as an alternative arg to `files`
const TaskCardSchema = CardSchema.extend({
  type: z.literal(CardType.Task),
  files: z.object({
    "index.md": FileContentsSchema,
    "template.js": FileContentsSchema,
    "test.js": FileContentsSchema,
  }).catchall(FileContentsSchema)
});

const AnyCardSchema = z.union([FlashCardSchema, TaskCardSchema]);

export type File = z.infer<typeof FileContentsSchema>;
export type FlashCard = z.infer<typeof FlashCardSchema>;
export type TaskCard = z.infer<typeof TaskCardSchema>;
export type AnyCard = z.infer<typeof AnyCardSchema>;

export const CreateFlashCardSchema = FlashCardSchema.partial({ id: true });
export const CreateTaskCardSchema = TaskCardSchema.partial({ id: true });
export const CreateAnyCardSchema = z.union([CreateFlashCardSchema, CreateTaskCardSchema]);

export const UpdateFlashCardSchema = FlashCardSchema.extend({
  files: FlashCardSchema.shape.files.partial({
    "front.md": true,
    "back.md": true,
  })
});
export const UpdateTaskCardSchema = TaskCardSchema.extend({
  files: TaskCardSchema.shape.files.partial({
    "index.md": true,
    "template.js": true,
    "test.js": true,
  })
});
export const UpdateAnyCardSchema = z.union([UpdateFlashCardSchema, UpdateTaskCardSchema]);

export type CreateFlashCard = z.infer<typeof CreateFlashCardSchema>;
export type CreateTaskCard = z.infer<typeof CreateTaskCardSchema>;
export type CreateAnyCard = z.infer<typeof CreateAnyCardSchema>;
export type UpdateAnyCard = z.infer<typeof UpdateAnyCardSchema>;
export type UpdateFlashCard = z.infer<typeof UpdateFlashCardSchema>;
export type UpdateTaskCard = z.infer<typeof UpdateTaskCardSchema>;

export const getFileContents = (filename: string, card: CreateAnyCard | UpdateAnyCard) => {
  const meta = card.files[filename];
  return meta && meta.file.contents;
}

export const createCard = async (props: CreateAnyCard | UpdateAnyCard): Promise<void>  => {
  const db = await getDB();
  const cardObjectStore = db.transaction('cards', 'readwrite').objectStore('cards');

  if (props.id) {
    const data = UpdateAnyCardSchema.parse(props);
    const req = cardObjectStore.put(data);
    return new Promise((resolve, reject) => {
      req.onerror   = (e) => reject(e);
      req.onsuccess = (e) => resolve();
    });
  }
  const data = CreateAnyCardSchema.parse(props);
  const req = cardObjectStore.add(data);

  return new Promise((resolve, reject) => {
    req.onerror   = (e) => reject(e);
    req.onsuccess = (e) => resolve();
  });
}
