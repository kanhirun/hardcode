'use client';

import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
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

export const CardCreateDialog = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const initState: CreateCardProps = {
    type: 'flashcard',
    front: '',
    back: ''
  };
  const [createCardProps, setCreateCardProps] = useState(initState);
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
        { children }
      </DialogTrigger>
      <DialogContent className='w-full'>
        <DialogHeader className=''>
          <DialogTitle className='flex items-center gap-2'>
            <div>
              { createCardProps.type === 'flashcard' && 'Flash card' }
              { createCardProps.type === 'taskcard' && 'Task card' }
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem 
                  onClick={() => setCreateCardProps({ ...createCardProps, type: 'flashcard' })}>
                    Flash card
                  </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setCreateCardProps({ ...createCardProps, type: 'taskcard' })}>
                    Task card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='h-120 space-y-4'>
          <div className='flex gap-2 w-full h-full'>
            <textarea
              id='front'
              value={createCardProps.front}
              onChange={(e) => setCreateCardProps({ ...createCardProps, front: e.target.value })}
              className='p-2 border rounded-md'
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
