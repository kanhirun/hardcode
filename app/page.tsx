'use client';

import Image from "next/image";
import { useReducer } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Plus } from 'lucide-react'

const Toolbar = () => {
  return (
    <div className='flex justify-end mt-20 mx-20'>
      <Button variant='secondary'>
        <Plus />
        Add card
      </Button>
    </div>
  );
}


const StepButton = (props: ButtonProps) => {
  return (
    <Button {...props}>
      {props.children}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>↵</Kbd>
      </KbdGroup>
    </Button>
  );
}

type Card = React.ReactNode;

type DeckProps = {
  title: string;
  description: string;
}

type DeckState = {
  cards: Card[];
}

type DeckAction = {
  type: 'NEXT'
}

const reducer = (state: DeckState, action: DeckAction) => {
  switch (action.type) {
    case 'NEXT': 
      return state;
    default:
      throw Error('Undefined action');
  }
}

const Deck = ({title, description}: DeckProps) => {
  const initState: DeckState = {
    cards: [
      <div>
        <h1>{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <StepButton className="mt-10">Start</StepButton>
      </div>,
    ]
  }
  const [state, dispatch] = useReducer(reducer, initState)

  return (
    <>
      {
        state.cards.map((card, idx) => <div key={idx}>{card}</div>)
      }
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen justify-center">
      <Toolbar />
      <div className='w-6/12 m-auto mt-20'>
        <Deck 
          title='Javascript'
          description="JavaScript is a high-level programming language for creating dynamic and interactive web pages. It works with HTML and CSS to enhance user interfaces with features like animations and asynchronous data fetching. JavaScript's frameworks and libraries, such as React and Angular, expand its capabilities in modern web development."
        />
      </div>
    </div>
  );
}
