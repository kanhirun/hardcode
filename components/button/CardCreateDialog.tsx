'use client';

import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { createCard, type CreateCardProps } from '@/lib/cards';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type SplitPaneProps = {
  orientation: "horizontal" | "vertical";
}

export const CardCreateDialog = ({ children }: { children?: React.ReactNode }) => {
  const initState: CreateCardProps = {
    type: 'flashcard',
    front: '',
    back: ''
  };

  const [open, setOpen] = useState(false);
  const [createCardProps, setCreateCardProps] = useState(initState);
  const {mutate, isPending} = useMutation({ 
    mutationFn: createCard,
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
        <Tabs defaultValue="flashcard">
          <TabsList>
            <TabsTrigger value="flashcard">Flash Card</TabsTrigger>
            <TabsTrigger value="taskcard">Task Card</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>
          <form 
            onSubmit={(e) => { e.preventDefault(); mutate(createCardProps) }}
            className='flex flex-col h-100 space-y-4'
          >
            <TabsContent value="flashcard">
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
                  required={createCardProps.type === 'flashcard'}
                />
              </div>
            </TabsContent>
            <TabsContent value="taskcard">
              <div className='flex flex-col h-full gap-2 font-mono'>
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
                  className='p-2 border rounded-md'
                  required={createCardProps.type === 'flashcard'}
                />
              </div>
            </TabsContent>
            <TabsContent value="tests" className='flex-1'>
              <textarea
                id='tests'
                value={createCardProps.back}
                onChange={(e) => setCreateCardProps({ ...createCardProps, back: e.target.value })}
                className='w-full h-full p-2 border rounded-md'
                required={createCardProps.type === 'taskcard'}
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
