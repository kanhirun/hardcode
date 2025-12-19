import { TemplateType, TemplateEnum } from '@/lib/models/templates';
import { IssueComponent } from './Issue';
import { FlashComponent } from './Flash';

type CardProps = {
  card: TemplateType;
  onRunSuccess: () => void;
  children?: React.ReactNode;
}

export const CardComponent = ({
  card,
  onRunSuccess: handleRunSuccess,
  children
}: CardProps) => {
  switch (card.type) {
    case TemplateEnum.Flash:
      return <FlashComponent card={card} onShowAnswer={handleRunSuccess} />;
    case TemplateEnum.Task:
      return <IssueComponent card={card} onRunSuccess={handleRunSuccess}/>;
  default:
    console.error('Unable to render card');
    return <></>
  }
} 
