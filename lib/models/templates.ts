import * as z from 'zod';

export enum TemplateEnum {
  Flash,
  Task,
}
export const TemplateEnumSchema = z.enum(TemplateEnum);
export const TemplateBaseSchema = z.object({
  id: z.number(),
  type: TemplateEnumSchema,
});

const FileContentsSchema = z.object({
  file: z.object({
    contents: z.string()
  })
});

const FlashTemplateSchema = TemplateBaseSchema.extend({
  type: z.literal(TemplateEnum.Flash),
  files: z.object({
    "front.md": FileContentsSchema,
    "back.md": FileContentsSchema
  }).catchall(FileContentsSchema)
})

// TODO: Consider adding `snapshotPath` as an alternative arg to `files`
const IssueTemplateSchema = TemplateBaseSchema.extend({
  type: z.literal(TemplateEnum.Task),
  files: z.object({
    "index.md": FileContentsSchema,
    "template.js": FileContentsSchema,
    "test.js": FileContentsSchema,
  }).catchall(FileContentsSchema)
});

const TemplateSchema = z.union([FlashTemplateSchema, IssueTemplateSchema]);

export type File = z.infer<typeof FileContentsSchema>;
export type FlashTemplateType = z.infer<typeof FlashTemplateSchema>;
export type IssueTemplateType = z.infer<typeof IssueTemplateSchema>;
export type TemplateType = z.infer<typeof TemplateSchema>;

export const CreateFlashTemplateSchema = FlashTemplateSchema.partial({ id: true });
export const CreateIssueTemplateSchema = IssueTemplateSchema.partial({ id: true });
export const CreateAnyCardSchema = z.union([CreateFlashTemplateSchema, CreateIssueTemplateSchema]);

export const UpdateFlashTemplateSchema = FlashTemplateSchema.extend({
  files: FlashTemplateSchema.shape.files.partial({
    "front.md": true,
    "back.md": true,
  })
});
export const UpdateIssueTemplateSchema = IssueTemplateSchema.extend({
  files: IssueTemplateSchema.shape.files.partial({
    "index.md": true,
    "template.js": true,
    "test.js": true,
  })
});
export const UpdateTemplateSchema = z.union([UpdateFlashTemplateSchema, UpdateIssueTemplateSchema]);

export type CreateFlashTemplateType = z.infer<typeof CreateFlashTemplateSchema>;
export type CreateTaskTemplateType = z.infer<typeof CreateIssueTemplateSchema>;
export type CreateAnyTemplateType = z.infer<typeof CreateAnyCardSchema>;
export type UpdateAnyTemplateType = z.infer<typeof UpdateTemplateSchema>;
export type UpdateFlashTemplateType = z.infer<typeof UpdateFlashTemplateSchema>;
export type UpdateIssueTemplateType = z.infer<typeof UpdateIssueTemplateSchema>;
