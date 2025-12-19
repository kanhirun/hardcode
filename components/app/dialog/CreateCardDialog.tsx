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
import { TemplateEnum, UpdateIssueTemplateType, CreateFlashTemplateType, CreateTaskTemplateType, UpdateAnyTemplateType, UpdateFlashTemplateType } from '@/lib/models/templates';
import { getFileContents, createTemplate } from '@/lib/actions/templates';

type Props = {
  card?: UpdateAnyTemplateType;
  children?: React.ReactNode
};

type State = {
  isOpen: boolean;
  selected: TemplateEnum,
  flashProps: CreateFlashTemplateType | UpdateFlashTemplateType,
  issueProps: CreateTaskTemplateType | UpdateIssueTemplateType,
}

type Action = 
  {
    type: 'UPDATE_FILE',
    payload: {
      cardType: TemplateEnum,
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
      cardType: TemplateEnum
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

const EMPTY_FLASH: CreateFlashTemplateType = {
  type: TemplateEnum.Flash,
  files: {
    "front.md": EMPTY_FILE_CONTENTS,
    "back.md": EMPTY_FILE_CONTENTS
  }
}

const EMPTY_TASK: CreateTaskTemplateType = {
  type: TemplateEnum.Task,
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
        selected: TemplateEnum.Flash,
        flashProps: EMPTY_FLASH,
        issueProps: EMPTY_TASK,
      }
    case 'UPDATE_FILE': 
      switch (action.payload.cardType) {
        case TemplateEnum.Flash: {
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
        case TemplateEnum.Task: {
          return {
            ...state,
            // @ts-ignore
            issueProps: {
              ...state.issueProps,
              files: {
                ...state.issueProps.files,
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
    selected: cardToUpdate?.type || TemplateEnum.Flash,
    flashProps: cardToUpdate?.type === TemplateEnum.Flash ? cardToUpdate : EMPTY_FLASH,
    issueProps: cardToUpdate?.type === TemplateEnum.Task ? cardToUpdate : EMPTY_TASK
  }

  const [state, dispatch] = useReducer(reducer, initState);
  const {mutate, isPending} = useMutation({ 
    mutationFn: createTemplate,
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
      <DialogContent style={{ maxWidth: 'none', width: '1000px' }}>
        <Tabs defaultValue={state.selected.toString()}>
          <TabsList>
            <TabsTrigger value={TemplateEnum.Flash.toString()} onClick={() => dispatch({ type: 'SELECT_CARD_TYPE', payload: { cardType: TemplateEnum.Flash }})}>
              <SplitSquareHorizontal />
              Flash Card
            </TabsTrigger>
            <TabsTrigger value={TemplateEnum.Task.toString()} onClick={() => dispatch({ type: 'SELECT_CARD_TYPE', payload: { cardType: TemplateEnum.Task }})}>
              <SplitSquareVertical />
              Task Card
            </TabsTrigger>
          </TabsList>
          <form 
            onSubmit={e => {
              e.preventDefault();
              switch (state.selected) {
                case TemplateEnum.Flash:
                  mutate(state.flashProps);
                  break;
                case TemplateEnum.Task:
                  mutate(state.issueProps);
                  break;
                default:
                  console.error('Failed to create');
              }
            }}
            className='flex flex-col h-150 space-y-4'
          >
            <TabsContent value={TemplateEnum.Flash.toString()}>
              <div className='flex gap-2 h-full font-mono'>
                <textarea
                  id='front.md'
                  value={getFileContents('front.md', state.flashProps)}
                  onChange={e => dispatch({
                    type: 'UPDATE_FILE',
                    payload: {
                      cardType: TemplateEnum.Flash,
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
                        cardType: TemplateEnum.Flash,
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
            <TabsContent value={TemplateEnum.Task.toString()}>
              <div className='flex h-full gap-2'>
                <div className='flex flex-col gap-2 w-full'>
                  <textarea
                    id='index.md'
                    value={getFileContents('index.md', state.issueProps)}
                    placeholder='Instructions...'
                    onChange={e => dispatch({
                      type: 'UPDATE_FILE',
                      payload: {
                        cardType: TemplateEnum.Task,
                        filename: 'index.md',
                        contents: e.target.value
                      }
                    })}
                    className='flex-1 p-2 border rounded-md font-mono resize-none overflow-auto'
                    required
                  />
                  <textarea
                    id='template.js'
                    placeholder='Template, optional...'
                    value={getFileContents('template.js', state.issueProps)}
                    onChange={e => dispatch({
                      type: 'UPDATE_FILE',
                      payload: {
                        cardType: TemplateEnum.Task,
                        filename: 'template.js',
                        contents: e.target.value
                      }
                    })}
                    className='p-2 border rounded-md font-mono h-30'
                  />
                </div>
                <div className='flex w-full'>
                  <textarea
                    id='test.js'
                    value={
                      getFileContents('test.js', state.issueProps)
                    }
                    placeholder='Tests...'
                    onChange={e => dispatch({
                      type: 'UPDATE_FILE',
                      payload: {
                        cardType: TemplateEnum.Task,
                        filename: 'test.js',
                        contents: e.target.value
                      }
                    })}
                    className='w-full h-full p-2 border rounded-md font-mono resize-none overflow-auto'
                    required={state.selected === TemplateEnum.Task}
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
