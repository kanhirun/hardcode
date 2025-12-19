import { Button } from "@/components/ui/button";
import { Plus, Import } from 'lucide-react';
import { CreateCardDialog } from "@/components/app/dialog";
import clsx from 'clsx';

export const Toolbar = ({ className }: { className: string }) => {
  return (
    <div className={clsx('flex justify-end gap-4 mt-20 mx-20', className)}>
      <Button variant='outline'>
        <Import />
        Import
      </Button>
      <CreateCardDialog>
        <Button variant='secondary'>
          <Plus />
          Add
        </Button>
      </CreateCardDialog>
    </div>
  );
}
