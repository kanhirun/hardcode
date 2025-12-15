import { createContext, useState, useEffect } from 'react';
import { WebContainer } from '@webcontainer/api'

export const WebContainerContext = createContext<WebContainer | null>(null);

export const WebContainerProvider = ({ children, instance: promise }: { instance: Promise<WebContainer>, children?: React.ReactNode }) => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    promise.then((instance) => {
      setWebContainer(instance)
    })
  }, [])

  return (
    <WebContainerContext.Provider value={webContainer}>
      {children}
    </WebContainerContext.Provider>
  );
}

