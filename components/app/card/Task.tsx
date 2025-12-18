import { useContext, useEffect, useCallback } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WebContainerContext } from '@/components/app/providers';
import { CreateCardDialog } from '@/components/app/dialog';
import { TaskCardProps } from '@/lib/models/cards';
import { getFileContents } from '@/lib/actions/cards';

type ComponentProps = {
  card: TaskCardProps;
}

// TODO: Expand StepButton to include behaviors
export const TaskComponent = ({
  card,
}: ComponentProps) => {
   let taskLoaded: Promise<void> | undefined;
   const webContainer = useContext(WebContainerContext);

   const handleRun = useCallback(async () => {
     return webContainer!.spawn('node', ['test.js'])
       .then(proc => {
         proc.output.pipeTo(new WritableStream({
           write(data) { console.log(data) }
         }))
         return proc;
       })
       .then(proc => proc.exit)
       .then(code => code === 0);
   }, [webContainer])

   const {mutate, isPending} = useMutation({
     mutationFn: handleRun,
     onError: (e) => {
       console.error(e);
     },
     onSuccess: (v) => {
       console.log(v);
     }
   });

   useEffect(() => {
     taskLoaded = webContainer?.fs.writeFile('test.js', card.files['test.js'].file.contents);
     webContainer?.fs.readFile('test.js', 'utf8').then(console.log);
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
        <Input />
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

