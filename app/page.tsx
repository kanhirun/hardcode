'use client';

import { Toolbar } from '@/components/toolbar';
import { StepButton } from '@/components/button';
import { useMutation } from '@tanstack/react-query';
import { createDeck } from '@/lib/deck';
import { useState, useEffect } from 'react';
import type { Deck } from '@/lib/deck';
import { CardComponent } from '@/components/Card';

export default function DeckPage() {
  const [sliceIndex, setSliceIndex] = useState(0);
  const [deck, setDeck] = useState<Deck>({ cards: [] });
  const {
    mutate: createDeckAction,
  } = useMutation({
    mutationFn: createDeck,
    onError: (e) => {
      console.error(e);
    },
    onSuccess: (deck => {
      setDeck(deck);
      setSliceIndex(sliceIndex + 1);
    })
  });

  useEffect(() => {
    if (sliceIndex > 0) {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, [sliceIndex]);

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
              hidden={sliceIndex > 0}
              onClick={() => createDeckAction()}
              className="mt-10"
            >
              Start
            </StepButton>
          </section>
          <section className='flex flex-col gap-10 mb-10'>
            { deck.cards
                .slice(0, sliceIndex)
                .map((card, idx) => (
                  <CardComponent 
                    key={idx}
                    card={card}
                    onClick={() => setSliceIndex(sliceIndex + 1)}
                  />
            ))}
          </section>
        </main>
    </div>
  );
}
