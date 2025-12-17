import { getDB } from '../db';
import { CreateAnyCard, UpdateAnyCard, UpdateAnyCardSchema, CreateAnyCardSchema } from '@/lib/models/cards';

export const getFileContents = (filename: string, card: CreateAnyCard | UpdateAnyCard) => {
  const meta = card.files[filename];
  return meta && meta.file.contents;
}

export const createCard = async (props: CreateAnyCard | UpdateAnyCard): Promise<void>  => {
  const db = await getDB();
  const cardObjectStore = db.transaction('cards', 'readwrite').objectStore('cards');

  if (props.id) {
    const data = UpdateAnyCardSchema.parse(props);
    const req = cardObjectStore.put(data);
    return new Promise((resolve, reject) => {
      req.onerror   = (e) => reject(e);
      req.onsuccess = (e) => resolve();
    });
  }
  const data = CreateAnyCardSchema.parse(props);
  const req = cardObjectStore.add(data);

  return new Promise((resolve, reject) => {
    req.onerror   = (e) => reject(e);
    req.onsuccess = (e) => resolve();
  });
}
