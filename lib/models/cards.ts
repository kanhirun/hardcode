import * as z from 'zod';
import { TemplateBaseSchema } from '@/lib/models/templates'

export const CardSchema = z.object({
  templateId: TemplateBaseSchema.shape.id,
  submission: z.string().optional(),
  reviewAt: z.date()
});

export type CardType = z.infer<typeof CardSchema>;
export type CreateCardType = z.infer<typeof CardSchema>;
