import { createContext, useState, useEffect } from 'react';
import { WebContainer } from '@webcontainer/api'

export const WebContainerContext = createContext<WebContainer | null>(null);

export const WebContainerProvider = ({
  children,
  instance: promise
}: { instance: Promise<WebContainer>, children?: React.ReactNode }) => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    promise
      .then(instance => {
        return instance.mount({}).then(() => instance);
      })
      .then(instance => {
        return instance.spawn('npm', ['install', '--save-dev', 'uvu'])
          .then(proc => {
            proc.output.pipeTo(new WritableStream({
              write(data) { console.log(data) }
            }));
            return proc.exit;
          })
          .then(() => instance)
      })
      .then(instance => {
        setWebContainer(instance);
        return instance;
      })
  }, [])

  return (
    <WebContainerContext.Provider value={webContainer}>
      {children}
    </WebContainerContext.Provider>
  );
}

