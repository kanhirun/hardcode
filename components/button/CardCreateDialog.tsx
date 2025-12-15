'use client';

import { Button } from '@/components/ui/button';
import { SplitSquareVertical, SplitSquareHorizontal, Plus, ChevronDown, Code } from 'lucide-react';
import clsx from 'clsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { createCard } from '@/lib/cards';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type SplitPaneProps = {
  orientation: "horizontal" | "vertical";
}

export const CardCreateDialog = ({ children }: { children?: React.ReactNode }) => {
  const initState: Partial<any> = {
    type: 'flashcard'
  };

  const [open, setOpen] = useState(false);
  const [createCardProps, setCreateCardProps] = useState(initState);
  const {mutate, isPending} = useMutation({ 
    mutationFn: createCard,
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      setOpen(false);
      setCreateCardProps(initState);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent style={{ maxWidth: 'none', width: '800px' }}>
        <DialogTitle>
          Create a card
        </DialogTitle>
        <Tabs defaultValue="flashcard">
          <TabsList>
            <TabsTrigger value="flash" onClick={() => setCreateCardProps({ ...createCardProps, type: 'flash' })}>
              <SplitSquareHorizontal />
              Flash Card
            </TabsTrigger>
            <TabsTrigger value="task" onClick={() => setCreateCardProps({ ...createCardProps, type: 'task' })}>
              <SplitSquareVertical />
              Task Card
            </TabsTrigger>
            <TabsTrigger value="tests">
              <Code />
              Tests
            </TabsTrigger>
          </TabsList>
          <form 
            onSubmit={(e) => { e.preventDefault(); mutate(createCardProps) }}
            className='flex flex-col h-100 space-y-4'
          >
            <TabsContent value="flash">
              <div className='flex gap-2 h-full font-mono'>
                <textarea
                  id='front'
                  value={createCardProps.front}
                  onChange={(e) => setCreateCardProps({ ...createCardProps, front: e.target.value })}
                  className='flex-1 p-2 border rounded-md'
                  required
                />
                <textarea
                  id='back'
                  value={createCardProps.back}
                  onChange={(e) => setCreateCardProps({ ...createCardProps, back: e.target.value })}
                  className='flex-1 p-2 border rounded-md'
                  required
                />
              </div>
            </TabsContent>
            <TabsContent value="task">
              <div className='flex flex-col h-full gap-2'>
                <textarea
                  id='text'
                  value={createCardProps.text}
                  onChange={(e) => setCreateCardProps({ ...createCardProps, text: e.target.value })}
                  className='flex-1 p-2 border rounded-md'
                  required
                />
                <textarea
                  id='template'
                  value={createCardProps.template}
                  onChange={(e) => setCreateCardProps({ ...createCardProps, template: e.target.value })}
                  className='p-2 border rounded-md font-mono'
                />
              </div>
            </TabsContent>
            <TabsContent value="tests" className='flex-1'>
              <textarea
                id='tests'
                value={createCardProps.tests}
                onChange={(e) => setCreateCardProps({ ...createCardProps, tests: e.target.value })}
                className='w-full h-full p-2 border rounded-md'
                required={createCardProps.type === 'task'}
              />
            </TabsContent>
            <div className='flex justify-end gap-2'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
