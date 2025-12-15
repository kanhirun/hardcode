import type { Card } from '@/lib/cards'
import { Button } from '@/components/ui/button';
import { useState, useContext } from 'react';
import { Input } from '@/components/ui/input';
import { WebContainerContext } from '@/components/providers';

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
  const webContainer = useContext(WebContainerContext);

  // TODO: Move me to flashcard
  const handleOpen = () => {
    setIsOpen(!isOpen)
    handleClick();
  }

  switch (card.type) {
    case 'flash':
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
   case 'task':
     const testFile = {
       'index.md': {
         file: {
           contents: `
             hello world!
           `
         }
       }
     }
     console.log(webContainer);
     webContainer?.mount(testFile).then(() => {
       webContainer.fs.readFile('index.md', 'utf8').then(console.log);
     });

     return (
        <div className='
          flex flex-col items-start gap-8 p-6 rounded
          font-mono text-card-foreground bg-card
        '>
          <p className='whitespace-pre-line'>
            {card.text}
          </p>
          <div className='flex gap-2'>
            <Input />
            <Button className='font-sans'>
              Run
            </Button>
          </div>
        </div>
     );
  default:
    return <></>
  }
} 
