import type { Card } from '@/lib/cards'
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type CardProps = {
  card: Card;
  children?: React.ReactNode;
}

export const CardComponent = ({
  card,
  children
}: CardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='
      flex flex-col items-start gap-4 p-6 rounded
      text-card-foreground bg-card
    '>
      <div>
        {card.front}
      </div>
      { !isOpen ?
          <Button onClick={() => setIsOpen(!isOpen)}>
            Show Answer
          </Button> :
          <div className='flex flex-col gap-2'>
            <div>Result:</div>
            <div>{card.back}</div>
          </div>
      }
    </div>
  )
}
