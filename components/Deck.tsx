'use client';

import { Card } from '@/lib/cards';
import { CardComponent } from '@/components/Card';

type DeckProps = {
  cards: Card[]
}

export const Deck = ({ cards }: DeckProps) => {
  return (
    <>
      {
        cards.map((card, idx) => (
          <div key={idx}>
            <CardComponent card={card} />
          </div>
        ))
      }
    </>
  );
}

