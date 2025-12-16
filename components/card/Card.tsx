import { Card, CardType } from '@/lib/cards';
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
    case CardType.Flash:
      return <FlashComponent card={card} onShowAnswer={handleClick} />;
    case CardType.Task:
     return <TaskComponent card={card} />;
  default:
    console.error('Unable to render card');
    return <></>
  }
} 
