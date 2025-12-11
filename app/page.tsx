import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Plus } from 'lucide-react'

const Toolbar = () => {
  return (
    <div className='flex justify-end mt-20 mx-20'>
      <Button variant='secondary'>
        <Plus />
        Add card
      </Button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen justify-center">
      <Toolbar />
      <section className='w-6/12 m-auto mt-20'>
        <h1>Javascript</h1>
        <p className="text-muted-foreground">
          JavaScript is a high-level programming language for creating dynamic and interactive web pages. It works with HTML and CSS to enhance user interfaces with features like animations and asynchronous data fetching. JavaScript's frameworks and libraries, such as React and Angular, expand its capabilities in modern web development.
        </p>
        <Button size="lg" className="mt-6">
          Start
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>↵</Kbd>
          </KbdGroup>
        </Button>
      </section>
    </div>
  );
}
