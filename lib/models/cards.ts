import * as z from 'zod';
import { TemplateBaseSchema } from '@/lib/models/templates';

export const CardSchema = z.object({
  templateId: TemplateBaseSchema.shape.id,
  reviewAt: z.date()
});

export type Card = z.infer<typeof CardSchema>;
