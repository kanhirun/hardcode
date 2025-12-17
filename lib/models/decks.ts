import * as z from 'zod';
import { CardSchema } from '@/lib/models/cards';

export const DeckCardSchema = z.object({
  cardId: CardSchema.shape.id,
  reviewAt: z.date()
});

export type DeckCard = z.infer<typeof DeckCardSchema>;
