import { getTemplateObjectStore } from '../db';
import { CreateAnyTemplateType, UpdateAnyTemplateType, UpdateTemplateSchema, CreateAnyCardSchema } from '@/lib/models/templates';
import { createCard } from '@/lib/actions/cards';

export const getFileContents = (filename: string, card: CreateAnyTemplateType | UpdateAnyTemplateType) => {
  const meta = card.files[filename];
  return meta && meta.file.contents;
}

export const createTemplate = async (props: CreateAnyTemplateType | UpdateAnyTemplateType): Promise<void>  => {
  const templateStore = await getTemplateObjectStore('readwrite')

  if (props.id) {
    const data = UpdateTemplateSchema.parse(props);
    const updateRequest = templateStore.put(data);
    return new Promise((resolve, reject) => {
      updateRequest.onerror   = (e) => reject(e);
      updateRequest.onsuccess = (_) => resolve();
    });
  }

  const data = CreateAnyCardSchema.parse(props);
  const createRequest = templateStore.add(data);

  return new Promise((resolve, reject) => {
    createRequest.onerror   = (e) => reject(e);
    createRequest.onsuccess = (e) => {
      const id = (e.target as IDBRequest<number>).result;
      createCard(id)
        .then(() => resolve())
        .catch((e) => reject(e));
    }
  });
}
