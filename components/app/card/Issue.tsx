import { useContext, useEffect, useCallback, useState } from 'react';
import { LoaderCircle, CheckCircle, EditIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WebContainerContext } from '@/components/app/providers';
import { CreateCardDialog } from '@/components/app/dialog';
import { IssueTemplateType } from '@/lib/models/templates';
import { getFileContents } from '@/lib/actions/templates';
import { SandboxCodeEditor, SandboxProvider } from '@/components/ui/shadcn-io/sandbox';
import { useActiveCode } from '@codesandbox/sandpack-react';
import { File } from '@/lib/models/templates';
import { updateCardInputText } from '@/lib/actions/cards';

type Props = {
  card: IssueTemplateType;
  onRunSuccess: () => void;
}

const prepareFiles = (files: Record<string, File>) => {
  const res: any = {};

  for (const [filename, obj] of Object.entries(files)) {
    res[filename] = {
      code: obj.file.contents
    }
  }

  res['solution.js'] = {
    code: res['template.js'].code || '',
    active: true,
  }

  return res;
}

export const IssueComponent = (props: Props) => {
  return (
    <SandboxProvider theme='dark' files={prepareFiles(props.card.files)}>
      <_IssueComponent {...props}/>
    </SandboxProvider>
  );
}


function _IssueComponent({
  card,
  onRunSuccess: handleRunSuccess,
}: Props) {
   const webContainer = useContext(WebContainerContext);
   // TODO: Need a way to persist the solution...
   const { code, updateCode } = useActiveCode()
   const [isSolved, setIsSolved] = useState(false);

   const handleRun = useCallback(async (isSkipping: boolean) => {
     const runTest = () => webContainer!.spawn('node', ['test.js', `(${code})`])
       .then(proc => {
         proc.output.pipeTo(new WritableStream({
           write(data) { console.log(data) }
         }))
         return proc;
       })
       .then(proc => proc.exit)
       .then(code => code === 0);

     return updateCardInputText(card.id, code).then(() => runTest());
   }, [code, webContainer])

   const {mutate, isPending} = useMutation({
     mutationFn: handleRun,
     onError: (e) => {
       console.error(e);
     },
     onSuccess: (isPassed, isSkipping) => {
       if (isSkipping || isPassed) {
         setIsSolved(true);
         handleRunSuccess();
       }
     }
   });

   useEffect(() => {
     webContainer?.fs.writeFile('test.js', card.files['test.js'].file.contents);
   }, [webContainer, card]);

   const ButtonGroup = () => {
     return (
       <>
        <Button className='font-sans' onClick={() => mutate(false)} disabled={isPending || webContainer === null || isSolved}>
          Run
          { isPending && <LoaderCircle className='animate-spin' /> }
          { isSolved && <CheckCircle /> }
        </Button>
        { !isSolved && (
          <>
            <Button  variant='outline' disabled={isSolved} onClick={() => mutate(true)}>
              Skip
            </Button>
            <CreateCardDialog card={card}>
              <Button  variant='ghost' disabled={isSolved}>
                <EditIcon />
              </Button>
            </CreateCardDialog>
          </>
        )}
      </>
     )
   };

  return (
    <div className='
      flex flex-col items-start gap-4 p-6 rounded
      font-mono text-card-foreground bg-card
    '>
      <p className='whitespace-pre-line'>
        {getFileContents('index.md', card)}
      </p>
      { card.files['template.js'].file.contents.length > 0 ? (
        <div className='flex flex-col gap-4 w-full'>
          <SandboxCodeEditor 
            showLineNumbers
            className='rounded'
          />
          <div className='flex gap-2'>
            <ButtonGroup />
          </div>
        </div>
      ) : (
        <div className='flex w-full gap-2'>
          <Input 
            disabled={isSolved}
            className='w-1/2'
            onChange={(e) => {
              updateCode(e.target.value);
            }}
          />
          <ButtonGroup />
        </div>
      )}
    </div>
  )
};

