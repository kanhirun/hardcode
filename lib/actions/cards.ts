import { getCardObjectStore, getTemplateObjectStore } from "@/lib/db";
import { CreateCardType, CardType } from '@/lib/models/cards';
import { TemplateType } from '@/lib/models/templates';

export const createCard = async (templateId: TemplateType['id']): Promise<void> => {
  // TODO: Validate that card exists before creating deck card?
  const cardStore = await getCardObjectStore('readwrite')

  const created: CreateCardType = {
    templateId,
    reviewAt: new Date()
  }

  return new Promise((resolve, reject) => {
    const createRequest = cardStore.add(created);
    createRequest.onerror = reject;
    createRequest.onsuccess = () => { resolve(); }
  });
}

export const fetchNextCard = async (): Promise<TemplateType | null> => {
  const cardStore = await getCardObjectStore('readwrite')

  return new Promise((resolve, reject) => {
    let earliestReviewAt = new Date(8640000000000000);
    let earliestIndexCard: CardType | null = null;

    const cursor = cardStore.openCursor();

    cursor.onerror = () => reject();
    cursor.onsuccess = (e: Event) => {
      let cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;

      if (cursor) {
        if (cursor.value.reviewAt < earliestReviewAt) {
          earliestReviewAt = cursor.value.reviewAt;
          earliestIndexCard = cursor.value;
          cursor.continue();
          return;
        }
      }

      // Update index card's to review later
      const random = Math.floor(Math.random() * 10) + 1;
      const futureDate = new Date();
      futureDate.setDate(new Date().getDate() + random);

      const updateRequest = cardStore.put({
        ...earliestIndexCard,
        reviewAt: futureDate
      });

      updateRequest.onerror = reject;

      // Get card details
      updateRequest.onsuccess = async () => {
        const templateStore = await getTemplateObjectStore('readonly');
        const cardRequest = templateStore.get(earliestIndexCard!.templateId) as IDBRequest<TemplateType>;
        cardRequest.onerror = reject;
        cardRequest.onsuccess = (e) => {
          const found = (e.target as IDBRequest).result as TemplateType;
          resolve(found);
        }
      }
    };


  })
};

export const updateCardInputText = async (
  templateId: TemplateType['id'],
  text: CardType['submission']
): Promise<void> => {
  const cardStore = await getCardObjectStore('readwrite');
  const found = cardStore.get(templateId);

  return new Promise((resolve, reject) => {
    found.onerror = () => reject();
    found.onsuccess = (e) => {
      const found = (e.target as IDBRequest).result;
      const args: CardType = {
        ...found,
        submission: text
      }
      const updated = cardStore.put(args);

      updated.onerror = reject;
      updated.onsuccess = () => resolve();
    }
  });
}
