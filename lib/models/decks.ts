import * as z from 'zod';
import { BaseCardSchema } from '@/lib/models/cards';

export const IndexCardSchema = z.object({
  cardId: BaseCardSchema.shape.id,
  reviewAt: z.date()
});

export type IndexCard = z.infer<typeof IndexCardSchema>;
