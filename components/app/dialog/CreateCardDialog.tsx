'use client';

import { Button } from '@/components/ui/button';
import { SplitSquareVertical, SplitSquareHorizontal, Code } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { useReducer } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CardType, UpdateTaskCardProps, CreateFlashCardProps, CreateTaskCardProps, UpdateAnyCardProps, UpdateFlashCardProps } from '@/lib/models/cards';
import { getFileContents, createCard } from '@/lib/actions/cards';

type Props = {
  card?: UpdateAnyCardProps;
  children?: React.ReactNode
};

type State = {
  isOpen: boolean;
  selected: CardType,
  flashProps: CreateFlashCardProps | UpdateFlashCardProps,
  taskProps: CreateTaskCardProps | UpdateTaskCardProps,
}

type Action = 
  {
    type: 'UPDATE_FILE',
    payload: {
      cardType: CardType,
      filename: string,
      contents: string,
    }
  } |
  {
    type: 'CLEAR_INPUTS'
  } |
  {
    type: 'SELECT_CARD_TYPE',
    payload: {
      cardType: CardType
    }
  } |
  {
    type: 'OPEN_DIALOG'
  }

const EMPTY_FILE_CONTENTS = {
  file: { 
    contents: ""
  }
}

const EMPTY_FLASH: CreateFlashCardProps = {
  type: CardType.Flash,
  files: {
    "front.md": EMPTY_FILE_CONTENTS,
    "back.md": EMPTY_FILE_CONTENTS
  }
}

const EMPTY_TASK: CreateTaskCardProps = {
  type: CardType.Task,
  files: {
    "index.md": EMPTY_FILE_CONTENTS,
    "test.js": {
      file: {
        contents:
`const assert = require('assert');
const { test } = require('uvu');
const input = eval(process.argv[2]);

test('returns true', () => {
  assert.equal(input, true);
});

test.run();`
      }
    },
    "template.js": EMPTY_FILE_CONTENTS
  }
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'OPEN_DIALOG': 
      return {
        ...state,
        isOpen: !state.isOpen
      }
    case 'SELECT_CARD_TYPE':
      return {
        ...state,
        selected: action.payload.cardType
      }
    case 'CLEAR_INPUTS':
      return {
        isOpen: false,  // also clses dialog
        selected: CardType.Flash,
        flashProps: EMPTY_FLASH,
        taskProps: EMPTY_TASK,
      }
    case 'UPDATE_FILE': 
      switch (action.payload.cardType) {
        case CardType.Flash: {
          return {
            ...state,
            // @ts-ignore
            flashProps: {
              ...state.flashProps,
              files: {
                ...state.flashProps.files,
                [action.payload.filename]: {
                  file: {
                    contents: action.payload.contents
                  }
                }
              },
            }
          }
        }
        case CardType.Task: {
          return {
            ...state,
            // @ts-ignore
            taskProps: {
              ...state.taskProps,
              files: {
                ...state.taskProps.files,
                [action.payload.filename]: {
                  file: {
                    contents: action.payload.contents
                  }
                }
              },
            }
          }

        }
        default: {
          return state;
        }
      }
    default:
      return state;
  }
}

export const CreateCardDialog = ({
  card: cardToUpdate,
  children
}: Props) => {
  const initState: State = {
    isOpen: false,
    selected: cardToUpdate?.type || CardType.Flash,
    flashProps: cardToUpdate?.type === CardType.Flash ? cardToUpdate : EMPTY_FLASH,
    taskProps: cardToUpdate?.type === CardType.Task ? cardToUpdate : EMPTY_TASK
  }

  const [state, dispatch] = useReducer(reducer, initState);
  const {mutate, isPending} = useMutation({ 
    mutationFn: createCard,
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      dispatch({ type: 'CLEAR_INPUTS' });
    }
  });

  return (
    <Dialog open={state.isOpen} onOpenChange={() => dispatch({ type: 'OPEN_DIALOG' })}>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent style={{ maxWidth: 'none', width: '800px' }}>
        <Tabs defaultValue={state.selected.toString()}>
          <TabsList>
            <TabsTrigger value={CardType.Flash.toString()} onClick={() => dispatch({ type: 'SELECT_CARD_TYPE', payload: { cardType: CardType.Flash }})}>
              <SplitSquareHorizontal />
              Flash Card
            </TabsTrigger>
            <TabsTrigger value={CardType.Task.toString()} onClick={() => dispatch({ type: 'SELECT_CARD_TYPE', payload: { cardType: CardType.Task }})}>
              <SplitSquareVertical />
              Task Card
            </TabsTrigger>
          </TabsList>
          <form 
            onSubmit={e => {
              e.preventDefault();
              switch (state.selected) {
                case CardType.Flash:
                  mutate(state.flashProps);
                  break;
                case CardType.Task:
                  mutate(state.taskProps);
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
                  id='front.md'
                  value={getFileContents('front.md', state.flashProps)}
                  onChange={e => dispatch({
                    type: 'UPDATE_FILE',
                    payload: {
                      cardType: CardType.Flash,
                      filename: 'front.md',
                      contents: e.target.value
                    }
                  })}
                  className='flex-1 p-2 border rounded-md resize-none'
                  required
                />
                <textarea
                  id='back'
                  value={getFileContents('back.md', state.flashProps)}
                  onChange={e => {
                    dispatch({
                      type: 'UPDATE_FILE',
                      payload: {
                        cardType: CardType.Flash,
                        filename: 'back.md',
                        contents: e.target.value
                      }
                    });
                  }}
                  className='flex-1 p-2 border rounded-md resize-none'
                  required
                />
              </div>
            </TabsContent>
            <TabsContent value={CardType.Task.toString()}>
              <div className='flex h-full gap-2'>
                <div className='flex w-full'>
                  <textarea
                    id='index.md'
                    value={getFileContents('index.md', state.taskProps)}
                    placeholder='Instructions...'
                    onChange={e => dispatch({
                      type: 'UPDATE_FILE',
                      payload: {
                        cardType: CardType.Task,
                        filename: 'index.md',
                        contents: e.target.value
                      }
                    })}
                    className='flex-1 p-2 border rounded-md font-mono resize-none overflow-auto'
                    required
                  />
                </div>
                <div className='flex flex-col gap-2 w-full'>
                  <textarea
                    id='template.js'
                    placeholder='Template, optional...'
                    value={getFileContents('template.js', state.taskProps)}
                    onChange={e => dispatch({
                      type: 'UPDATE_FILE',
                      payload: {
                        cardType: CardType.Task,
                        filename: 'template.js',
                        contents: e.target.value
                      }
                    })}
                    className='p-2 border rounded-md font-mono h-1/3'
                  />
                  <textarea
                    id='test.js'
                    value={
                      getFileContents('test.js', state.taskProps)
                    }
                    placeholder='Tests...'
                    onChange={e => dispatch({
                      type: 'UPDATE_FILE',
                      payload: {
                        cardType: CardType.Task,
                        filename: 'test.js',
                        contents: e.target.value
                      }
                    })}
                    className='w-full h-full p-2 border rounded-md font-mono resize-none overflow-auto'
                    required={state.selected === CardType.Task}
                  />
                </div>
              </div>
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
