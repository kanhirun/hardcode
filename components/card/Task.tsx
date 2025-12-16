import { Task } from '@/lib/cards';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { Input } from '@/components/ui/input';
import { WebContainerContext } from '@/components/providers';

export type TaskProps = {
  card: Task;
}

export const TaskComponent = ({ card }: TaskProps) => {
   const webContainer = useContext(WebContainerContext);
   const testFile = {
     'index.md': {
       file: {
         contents: `
           hello world!
         `
       }
     }
   }
  console.log(webContainer);
  webContainer?.mount(testFile).then(() => {
    webContainer.fs.readFile('index.md', 'utf8').then(console.log);
  });

  return (
    <div className='
      flex flex-col items-start gap-8 p-6 rounded
      font-mono text-card-foreground bg-card
    '>
      <p className='whitespace-pre-line'>
        {card.text}
      </p>
      <div className='flex gap-2'>
        <Input />
        <Button className='font-sans'>
          Run
        </Button>
      </div>
    </div>
  )
}

