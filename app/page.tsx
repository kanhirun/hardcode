'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toolbar, StepButton, CardComponent } from '@/components/app';
import { TemplateType } from '@/lib/models/templates';
import { fetchNextCard as mutationFn } from '@/lib/actions/cards';

export default function DeckPage() {
  const queryClient = useQueryClient();
  const [deck, setDeck] = useState<TemplateType[]>([]);
  const fetchNextCard = useMutation({
    mutationFn,
    onError: (e) => {
      console.error(e);
    },
    onSuccess: (card => {
      if (!card) {
        console.warn('No cards left');
        return;
      }

      queryClient.setQueryData(['cards', card.id], card);
      setDeck([ ...deck, card ]);
    })
  });

  useEffect(() => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
  }, [deck]);

  return (
    <div className="min-h-screen justify-center">
        <Toolbar className='md:sticky md:top-6'/>
        <main className='flex flex-col gap-10 m-auto mt-20 w-6/12'>
          <section>
            <h1>Javascript</h1>
            <p className="text-muted-foreground">
              JavaScript is a high-level programming language for creating dynamic and interactive web pages. It works with HTML and CSS to enhance user interfaces with features like animations and asynchronous data fetching. JavaScript's frameworks and libraries, such as React and Angular, expand its capabilities in modern web development.
            </p>
            <StepButton 
              hidden={deck.length > 0}
              onClick={() => fetchNextCard.mutate()}
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
                    onRunSuccess={() => fetchNextCard.mutate()}
                  />
            ))}
          </section>
        </main>
    </div>
  );
}
