import type { Card } from '@/lib/cards'
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type CardProps = {
  card: Card;
  onClick: () => void;
  children?: React.ReactNode;
}

export const CardComponent = ({
  card,
  onClick: handleClick,
  children
}: CardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen)
    handleClick();
  }

  return (
    <div className='
      flex flex-col items-start gap-4 p-6 rounded
      text-card-foreground bg-card
    '>
      <code>
        {card.front}
      </code>
      { !isOpen ?
          <Button onClick={handleOpen}>
            Show Answer
          </Button> :
          <div className='flex flex-col gap-2'>
            <div>Result:</div>
            <code>{card.back}</code>
          </div>
      }
    </div>
  )
} 
