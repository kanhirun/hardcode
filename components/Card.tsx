import type { Card } from '@/lib/cards'
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

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

  // TODO: Move me to flashcard
  const handleOpen = () => {
    setIsOpen(!isOpen)
    handleClick();
  }

  switch (card.type) {
    case 'flashcard':
      return (
        <div className='
          flex flex-col items-start gap-4 p-6 rounded
          text-card-foreground bg-card
        '>
          <p className='font-mono whitespace-pre-line'>
            {card.front}
          </p>
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
      );
   case 'taskcard':
     return (
        <div className='
          flex flex-col items-start gap-4 p-6 rounded
          text-card-foreground bg-card
        '>
          <p className='font-mono whitespace-pre-line'>
            {card.front}
          </p>
          <div className='flex gap-2'>
            <Input />
            <Button>
              Run
            </Button>
          </div>
        </div>
     );
  default:
    return <></>
  }
} 
