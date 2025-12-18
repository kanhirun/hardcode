import { getDB } from '../db';
import { CreateAnyCardProps, UpdateAnyCardProps, UpdateAnyCardSchema, CreateAnyCardSchema } from '@/lib/models/cards';
import { createIndexCard } from '@/lib/actions/indexCards';

export const getFileContents = (filename: string, card: CreateAnyCardProps | UpdateAnyCardProps) => {
  const meta = card.files[filename];
  return meta && meta.file.contents;
}

export const createCard = async (props: CreateAnyCardProps | UpdateAnyCardProps): Promise<void>  => {
  const db = await getDB();
  const cardObjectStore = db.transaction('cards', 'readwrite').objectStore('cards');

  if (props.id) {
    const data = UpdateAnyCardSchema.parse(props);
    const updateRequest = cardObjectStore.put(data);
    return new Promise((resolve, reject) => {
      updateRequest.onerror   = (e) => reject(e);
      updateRequest.onsuccess = (e) => resolve();
    });
  }

  const data = CreateAnyCardSchema.parse(props);
  const createRequest = cardObjectStore.add(data);

  return new Promise((resolve, reject) => {
    createRequest.onerror   = (e) => reject(e);
    createRequest.onsuccess = (e) => {
      const id = (e.target as IDBRequest<number>).result;
      createIndexCard(id)
        .then(() => resolve())
        .catch((e) => reject(e));
    }
  });
}
