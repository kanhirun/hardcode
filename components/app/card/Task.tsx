import { useContext, useEffect, useCallback, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
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

// TODO: Expand StepButton to include behaviors
export const TaskComponent = ({
  card,
  onRunSuccess: handleRunSuccess,
}: Props) => {
   let taskLoaded: Promise<void> | undefined;
   const webContainer = useContext(WebContainerContext);
   const [inputText, setInputText] = useState('');

   const handleRun = useCallback(async () => {
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
     onSuccess: (isPassed) => {
       if (!isPassed) {
         return;
       }

       // TODO: Disable button and fields and call handler
       handleRunSuccess()
     }
   });

   useEffect(() => {
     taskLoaded = webContainer?.fs.writeFile('test.js', card.files['test.js'].file.contents);
   }, [webContainer, card]);

  return (
    <div className='
      flex flex-col items-start gap-8 p-6 rounded
      font-mono text-card-foreground bg-card
    '>
      <p className='whitespace-pre-line'>
        {getFileContents('index.md', card)}
      </p>
      <div className='flex gap-2'>
        <Input onChange={(e) => {
          setInputText(e.target.value);
        }}/>
        <Button className='font-sans' onClick={() => mutate()} disabled={isPending || webContainer === null}>
          Run
          { isPending && <LoaderCircle className='animate-spin' /> }
        </Button>
        <CreateCardDialog card={card}>
          <Button  variant='outline' >
            Edit
          </Button>
        </CreateCardDialog>
      </div>
    </div>
  )
}

