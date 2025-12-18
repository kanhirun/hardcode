'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Toolbar, StepButton, CardComponent } from '@/components/app';
import { Card } from '@/lib/models/cards';
import { fetchNextIndexCard } from '@/lib/actions/indexCards';

export default function DeckPage() {
  const [deck, setDeck] = useState<Card[]>([]);
  const { mutate } = useMutation({
    mutationFn: fetchNextIndexCard,
    onError: (e) => {
      console.error(e);
    },
    onSuccess: (card => {
      if (!card) {
        console.warn('No cards left');
        return;
      }

      setDeck([ ...deck, card ]);

      window.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: 'smooth' 
      });
    })
  });

  return (
    <div className="min-h-screen justify-center">
        <Toolbar />
        <main className='flex flex-col gap-10 m-auto mt-20 w-6/12'>
          <section>
            <h1>Javascript</h1>
            <p className="text-muted-foreground">
              JavaScript is a high-level programming language for creating dynamic and interactive web pages. It works with HTML and CSS to enhance user interfaces with features like animations and asynchronous data fetching. JavaScript's frameworks and libraries, such as React and Angular, expand its capabilities in modern web development.
            </p>
            <StepButton 
              hidden={deck.length > 1}
              onClick={() => mutate()}
              className="mt-10"
            >
              Start
            </StepButton>
          </section>
          <section className='flex flex-col gap-10 mb-10'>
            { deck
                .map((card, idx) => (
                  <CardComponent 
                    key={idx}
                    card={card}
                    onRunSuccess={() => mutate()}
                  />
            ))}
          </section>
        </main>
    </div>
  );
}
