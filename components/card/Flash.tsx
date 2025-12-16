import type { Flash } from '@/lib/cards'
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export type FlashProps = {
  card: Flash;
  onShowAnswer: () => void;
}

export const FlashComponent = ({
  card,
  onShowAnswer: handleShowAnswer,
}: FlashProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen)
    handleShowAnswer();
  }

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
};

