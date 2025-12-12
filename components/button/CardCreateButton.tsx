'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { createCard, type CreateCardProps } from '@/lib/cards';
import { useState } from 'react';

export const CardCreateButton = () => {
  const [open, setOpen] = useState(false);
  const initState = { front: '', back: '' };
  const [createCardProps, setCreateCardProps] = useState<CreateCardProps>(initState);
  const {
    mutate: createCardAction,
    isPending,
  } = useMutation({ 
    mutationFn: createCard,
    onSuccess: () => {
      setOpen(false);
      setCreateCardProps(initState);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCardAction(createCardProps);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <Plus />
          Add card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Create a new flashcard by entering front and back content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='front' className='block text-sm font-medium mb-2'>
              Front
            </label>
            <textarea
              id='front'
              value={createCardProps.front}
              onChange={(e) => setCreateCardProps({ ...createCardProps, front: e.target.value })}
              className='w-full min-h-[100px] p-2 border rounded-md'
              placeholder='Enter front content...'
              required
            />
          </div>
          <div>
            <label htmlFor='back' className='block text-sm font-medium mb-2'>
              Back
            </label>
            <textarea
              id='back'
              value={createCardProps.back}
              onChange={(e) => setCreateCardProps({ ...createCardProps, back: e.target.value })}
              className='w-full min-h-[100px] p-2 border rounded-md'
              placeholder='Enter back content...'
              required
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
