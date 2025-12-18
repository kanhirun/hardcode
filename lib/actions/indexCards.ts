import { getDB } from "@/lib/db";
import { IndexCard } from '@/lib/models/decks';
import { Card } from '@/lib/models/cards';

export const createIndexCard = async (cardId: Card['id']): Promise<void> => {
  // TODO: Validate that card exists before creating deck card?
  const db = await getDB();
  const indexObjectStore = db
    .transaction('indexCards', 'readwrite')
    .objectStore('indexCards');

  const created: IndexCard = {
    cardId,
    reviewAt: new Date()
  }

  return new Promise((resolve, reject) => {
    const createRequest = indexObjectStore.add(created);
    createRequest.onerror = () => { reject(); }
    createRequest.onsuccess = () => { resolve(); }
  });
}

export const fetchNextIndexCard = async (): Promise<Card | null> => {
  const db = await getDB();
  const indexCardStore = db
    .transaction('indexCards', 'readwrite')
    .objectStore('indexCards');

  return new Promise((resolve, reject) => {
    let earliestReviewAt = new Date(8640000000000000);
    let earliestIndexCard: IndexCard | null = null;

    const cursor = indexCardStore.openCursor();

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

      const updateRequest = indexCardStore.put({
        ...earliestIndexCard,
        reviewAt: futureDate
      });

      updateRequest.onerror = () => reject();

      // Get card details
      updateRequest.onsuccess = () => {
        console.log('updated reviewAt');
        const cardObjectStore = db
          .transaction('cards', 'readonly')
          .objectStore('cards');
        const cardRequest = cardObjectStore.get(earliestIndexCard!.cardId) as IDBRequest<Card>;
        cardRequest.onerror = () => reject();
        cardRequest.onsuccess = (e) => {
          const found = (e.target as IDBRequest).result as Card;
          resolve(found);
        }
      }
    };


  })
};
