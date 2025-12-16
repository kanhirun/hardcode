import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { CreateCardDialog } from "@/components/dialog";

export const Toolbar = () => {
  return (
    <div className='flex justify-end mt-20 mx-20'>
      <CreateCardDialog>
        <Button variant='secondary'>
          <Plus />
          Add card
        </Button>
      </CreateCardDialog>
    </div>
  );
}
