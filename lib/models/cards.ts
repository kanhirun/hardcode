import * as z from 'zod';

export enum CardType {
  Flash,
  Task,
}
export const CardTypeEnum = z.enum(CardType);
export const BaseCardSchema = z.object({
  id: z.number(),
  type: CardTypeEnum,
});

const FileContentsSchema = z.object({
  file: z.object({
    contents: z.string()
  })
});

const FlashCardSchema = BaseCardSchema.extend({
  type: z.literal(CardType.Flash),
  files: z.object({
    "front.md": FileContentsSchema,
    "back.md": FileContentsSchema
  }).catchall(FileContentsSchema)
})

// TODO: Consider adding `snapshotPath` as an alternative arg to `files`
const TaskCardSchema = BaseCardSchema.extend({
  type: z.literal(CardType.Task),
  files: z.object({
    "index.md": FileContentsSchema,
    "template.js": FileContentsSchema,
    "test.js": FileContentsSchema,
  }).catchall(FileContentsSchema)
});

const CardSchema = z.union([FlashCardSchema, TaskCardSchema]);

export type File = z.infer<typeof FileContentsSchema>;
export type FlashCard = z.infer<typeof FlashCardSchema>;
export type TaskCard = z.infer<typeof TaskCardSchema>;
export type Card = z.infer<typeof CardSchema>;

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

export type CreateFlashCardProps = z.infer<typeof CreateFlashCardSchema>;
export type CreateTaskCardProps = z.infer<typeof CreateTaskCardSchema>;
export type CreateAnyCardProps = z.infer<typeof CreateAnyCardSchema>;
export type UpdateAnyCardProps = z.infer<typeof UpdateAnyCardSchema>;
export type UpdateFlashCardProps = z.infer<typeof UpdateFlashCardSchema>;
export type UpdateTaskCardProps = z.infer<typeof UpdateTaskCardSchema>;
