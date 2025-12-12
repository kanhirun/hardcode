import { Button, type ButtonProps } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

export const StepButton = (props: ButtonProps) => {
  return (
    <Button {...props}>
      {props.children}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>↵</Kbd>
      </KbdGroup>
    </Button>
  );
}

