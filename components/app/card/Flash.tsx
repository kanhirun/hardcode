import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { FlashCard } from '@/lib/models/cards'
import { getFileContents } from '@/lib/actions/cards';

export type FlashProps = {
  card: FlashCard;
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
        {getFileContents('front.md', card)}
      </p>
      { !isOpen ?
        <Button onClick={handleOpen}>
          Show Answer
        </Button> :
        <div className='flex flex-col gap-2'>
          <div>Result:</div>
          <code>{getFileContents('back.md', card)}</code>
        </div>
      }
    </div>
  );
};

