import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, ImportIcon } from 'lucide-react';
import { CreateCardDialog } from "@/components/app/dialog";
import { createTemplate } from '@/lib/actions/templates';
import clsx from 'clsx';
import { CreateAnyTemplateType, TemplateEnum } from '@/lib/models/templates';

type Props = {
  onImport: (files: CreateAnyTemplateType) => void;
}

const ImportButton = ({
  onImport: handleImport,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const mapped: Promise<any[]> = Promise.all(Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = (err) => reject(err);

        reader.onload = (e) => {
          const fileName = file.name;
          const fileContents = e.target?.result;
          // const filePath = file.webkitRelativePath;
          const results = [ 
            fileName,
            {
              file: {
                contents: fileContents 
              }
            }
          ];
          resolve(results);
        }

        reader.readAsText(file);
      });
    }));

    mapped
      .then(values => {
        const files = values.reduce((memo, value) => {
          return {
            ...memo,
            [value[0]]: value[1]
          }
        }, {});

        return {
          type: TemplateEnum.Task,
          files,
        }

      })
      .then(handleImport);
  }

  return (
    <Button variant='outline' onClick={() => fileInputRef.current?.click() }>
      <ImportIcon />
      Import
      <input 
        type='file' 
        // @ts-ignore
        webkitdirectory='true'
        multiple 
        ref={fileInputRef} 
        className='hidden'
        onChange={handleFileChange}
      />
    </Button>
  );
}

export const Toolbar = ({ className }: { className: string }) => {
  return (
    <div className={clsx('flex justify-end gap-4 mt-20 mx-20', className)}>
      <ImportButton onImport={createTemplate}/>
      <CreateCardDialog>
        <Button variant='secondary'>
          <Plus />
          Add
        </Button>
      </CreateCardDialog>
    </div>
  );
}
