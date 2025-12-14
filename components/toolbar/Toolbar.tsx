import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { CardCreateDialog } from "@/components/button";

export const Toolbar = () => {
  return (
    <div className='flex justify-end mt-20 mx-20'>
      <CardCreateDialog>
        <Button variant='secondary'>
          <Plus />
          Add card
        </Button>
      </CardCreateDialog>
    </div>
  );
}
