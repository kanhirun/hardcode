import type { Card } from '@/lib/cards'

type CardProps = {
  card: Card;
  children?: React.ReactNode;
}

export const CardComponent = ({
  card,
  children
}: CardProps) => {
  return (
    <div>
      {card.front}
      {card.back}
    </div>
  )
}
