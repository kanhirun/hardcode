import { useContext, useEffect, useCallback, useState } from 'react';
import { LoaderCircle, CheckCircle, EditIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WebContainerContext } from '@/components/app/providers';
import { CreateCardDialog } from '@/components/app/dialog';
import { TaskCard } from '@/lib/models/cards';
import { getFileContents } from '@/lib/actions/cards';

type Props = {
  card: TaskCard;
  onRunSuccess: () => void;
}


export const TaskComponent = ({
  card,
  onRunSuccess: handleRunSuccess,
}: Props) => {
   let taskLoaded: Promise<void> | undefined;
   const webContainer = useContext(WebContainerContext);
   const [inputText, setInputText] = useState(card.files['template.js'].file.contents);
   const [isDone, setIsDone] = useState(false);

   const handleRun = useCallback(async (isSkipping: boolean) => {
     return webContainer!.spawn('node', ['test.js', `(${inputText})`])
       .then(proc => {
         proc.output.pipeTo(new WritableStream({
           write(data) { console.log(data) }
         }))
         return proc;
       })
       .then(proc => proc.exit)
       .then(code => code === 0);
   }, [inputText, webContainer])

   const {mutate, isPending} = useMutation({
     mutationFn: handleRun,
     onError: (e) => {
       console.error(e);
     },
     onSuccess: (isPassed, isSkipping) => {
       if (isSkipping || isPassed) {
         setIsDone(true);
         handleRunSuccess();
       }
     }
   });

   useEffect(() => {
     taskLoaded = webContainer?.fs.writeFile('test.js', card.files['test.js'].file.contents);
   }, [webContainer, card]);

   const ButtonGroup = () => {
     return (
       <>
        <Button className='font-sans' onClick={() => mutate(false)} disabled={isPending || webContainer === null || isDone}>
          Run
          { isPending && <LoaderCircle className='animate-spin' /> }
          { isDone && <CheckCircle /> }
        </Button>
        <Button  variant='outline' disabled={isDone} onClick={() => mutate(true)}>
          Skip
        </Button>
        <CreateCardDialog card={card}>
          <Button  variant='ghost' disabled={isDone}>
            <EditIcon />
          </Button>
        </CreateCardDialog>
      </>
     )
   };

  return (
    <div className='
      flex flex-col items-start gap-8 p-6 rounded
      font-mono text-card-foreground bg-card
    '>
      <p className='whitespace-pre-line'>
        {getFileContents('index.md', card)}
      </p>
      { card.files['template.js'].file.contents.length > 0 ? (
        <div className='flex flex-col gap-4 w-full'>
          <textarea
            disabled={isDone}
            className='w-full h-100 overflow-auto resize-none p-4 bg-background rounded'
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <div className='flex gap-2'>
            <ButtonGroup />
          </div>
        </div>
      ) : (
        <div className='flex w-full gap-2'>
          <Input 
            disabled={isDone}
            className='w-1/2'
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <ButtonGroup />
        </div>
      )}
    </div>
  )
}

