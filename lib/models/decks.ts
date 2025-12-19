import * as z from 'zod';
import { BaseCardSchema } from '@/lib/models/cards';

export const IndexCardSchema = z.object({
  templateId: BaseCardSchema.shape.id,
  reviewAt: z.date()
});

export type IndexCard = z.infer<typeof IndexCardSchema>;
