import { Card, CardType } from '@/lib/models/cards';
import { TaskComponent } from './Task';
import { FlashComponent } from './Flash';

type CardProps = {
  card: Card;
  onRunSuccess: () => void;
  children?: React.ReactNode;
}

export const CardComponent = ({
  card,
  onRunSuccess: handleRunSuccess,
  children
}: CardProps) => {
  switch (card.type) {
    case CardType.Flash:
      return <FlashComponent card={card} onShowAnswer={handleRunSuccess} />;
    case CardType.Task:
      return <TaskComponent card={card} onRunSuccess={handleRunSuccess}/>;
  default:
    console.error('Unable to render card');
    return <></>
  }
} 
