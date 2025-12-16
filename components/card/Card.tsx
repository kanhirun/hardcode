import { Card } from '@/lib/cards';
import { TaskComponent } from './Task';
import { FlashComponent } from './Flash';

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
  switch (card.type) {
    case 'flash':
      return <FlashComponent card={card} onShowAnswer={handleClick} />;
    case 'task':
     return <TaskComponent card={card} />;
  default:
    return <></>
  }
} 
