import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { FlashCardProps } from '@/lib/models/cards'
import { getFileContents } from '@/lib/actions/cards';

type ComponentProps = {
  card: FlashCardProps;
  onShowAnswer: () => void;
}

export const FlashComponent = ({
  card,
  onShowAnswer: handleShowAnswer,
}: ComponentProps) => {
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
          <div className='font-mono'>{getFileContents('back.md', card)}</div>
        </div>
      }
    </div>
  );
};

