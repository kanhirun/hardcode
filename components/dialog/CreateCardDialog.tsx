'use client';

import { Button } from '@/components/ui/button';
import { SplitSquareVertical, SplitSquareHorizontal, Plus, ChevronDown, Code } from 'lucide-react';
import clsx from 'clsx';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { createCard } from '@/lib/cards';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CardType, Task, UpdateTask, CreateFlash, CreateTask, UpdateCard, UpdateFlash } from '@/lib/cards';

type Props = {
  card?: UpdateCard;
  children?: React.ReactNode
};

type State = {
  selected: CardType,
  props: {
    flash: CreateFlash | UpdateFlash,
    task: CreateTask | UpdateTask,
  }
}

const EMPTY_FLASH: CreateFlash = {
  type: CardType.Flash,
  front: '',
  back: '',
}

const EMPTY_TASK: CreateTask = {
  type: CardType.Task,
  files: {}
}

export const CreateCardDialog = ({
  card: cardToUpdate,
  children
}: Props) => {
  const initState: State = {
    selected: cardToUpdate?.type || CardType.Flash,
    props: {
      flash: cardToUpdate?.type === CardType.Flash ? cardToUpdate : EMPTY_FLASH,
      task: cardToUpdate?.type === CardType.Task ? cardToUpdate : EMPTY_TASK
    }
  }

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initState);
  const {mutate, isPending} = useMutation({ 
    mutationFn: createCard,
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      setOpen(false);
      setState({
        ...initState,
        props: {
          flash: EMPTY_FLASH,
          task: EMPTY_TASK,
        }
      });
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
        <Tabs defaultValue={state.selected.toString()}>
          <TabsList>
            <TabsTrigger value={CardType.Flash.toString()} onClick={() => setState({ ...state, selected: CardType.Flash })}>
              <SplitSquareHorizontal />
              Flash Card
            </TabsTrigger>
            <TabsTrigger value={CardType.Task.toString()} onClick={() => setState({ ...state, selected: CardType.Task })}>
              <SplitSquareVertical />
              Task Card
            </TabsTrigger>
            <TabsTrigger value="test.js">
              <Code />
              Tests
            </TabsTrigger>
          </TabsList>
          <form 
            onSubmit={e => {
              e.preventDefault();
              switch (state.selected) {
                case CardType.Flash:
                  mutate(state.props.flash);
                  break;
                case CardType.Task:
                  mutate(state.props.task);
                  break;
                default:
                  console.error('Failed to create');
              }
            }}
            className='flex flex-col h-100 space-y-4'
          >
            <TabsContent value={CardType.Flash.toString()}>
              <div className='flex gap-2 h-full font-mono'>
                <textarea
                  id='front'
                  value={state.props.flash.front}
                  onChange={e => setState({
                    ...state,
                    props: {
                      ...state.props,
                      flash: {
                        ...state.props.flash,
                        front: e.target.value
                      }
                    }
                  })}
                  className='flex-1 p-2 border rounded-md'
                  required
                />
                <textarea
                  id='back'
                  value={state.props.flash.back}
                  onChange={e => setState({
                    ...state,
                    props: {
                      ...state.props,
                      flash: {
                        ...state.props.flash,
                        back: e.target.value
                      }
                    }
                  })}
                  className='flex-1 p-2 border rounded-md'
                  required
                />
              </div>
            </TabsContent>
            <TabsContent value={CardType.Task.toString()}>
              <div className='flex flex-col h-full gap-2'>
                <textarea
                  id='index.md'
                  value={
                    state.props.task.files && state.props.task.files['index.md'] && state.props.task.files['index.md'].file.contents
                  }
                  onChange={(e) => setState({
                    ...state,
                    props: {
                      ...state.props,
                      task: {
                        ...state.props.task,
                        files: {
                          ...state.props.task.files,
                          'index.md': {
                            file: {
                              contents: e.target.value
                            }
                          }
                        }
                      }
                    }})
                  }
                  className='flex-1 p-2 border rounded-md'
                  required
                />
                <textarea
                  id='template.js'
                  value={
                    state.props.task.files && state.props.task.files['template.js'] && state.props.task.files['template.js'].file.contents
                  }
                  onChange={(e) => setState({
                    ...state,
                    props: {
                      ...state.props,
                      task: {
                        ...state.props.task,
                        files: {
                          ...state.props.task.files,
                          'template.js': {
                            file: {
                              contents: e.target.value
                            }
                          }
                        }
                      }
                    }})
                  }
                  className='p-2 border rounded-md font-mono'
                />
              </div>
            </TabsContent>
            <TabsContent value="test.js" className='flex-1'>
              <textarea
                id='test.js'
                value={
                    state.props.task.files && state.props.task.files['test.js'] && state.props.task.files['test.js'].file.contents
                }
                onChange={(e) => setState({
                  ...state,
                  props: {
                    ...state.props,
                    task: {
                      ...state.props.task,
                      files: {
                        ...state.props.task.files,
                        'test.js': {
                          file: {
                            contents: e.target.value
                          }
                        }
                      }
                    }
                  }
                })}
                className='w-full h-full p-2 border rounded-md font-mono'
                required={state.selected === CardType.Task}
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
