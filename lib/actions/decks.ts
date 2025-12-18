import { getDB } from "@/lib/db";
import { DeckCard } from '@/lib/models/decks';
import { AnyCard } from '@/lib/models/cards';

export const createIndexCard = async (cardId: AnyCard['id']): Promise<void> => {
  // TODO: Validate that card exists before creating deck card?
  const db = await getDB();
  const deckObjectStore = db.transaction('indexCards', 'readwrite').objectStore('decks');

  const created: DeckCard = {
    cardId,
    reviewAt: new Date()
  }

  return new Promise((resolve, reject) => {
    const createRequest = deckObjectStore.add(created);
    createRequest.onerror = () => { reject(); }
    createRequest.onsuccess = () => { resolve(); }
  });
}

// const fetchCardFromDeck = async (): Promise<AnyCard | null> => {
//   const db = await getDB();
//   const deckObjectStore = db.transaction('decks', 'readwrite').objectStore('decks');
//   const cardObjectStore = db.transaction('cards', 'readonly').objectStore('decks');
//
//   /// A very far date used as sentinel
//   let earliest = new Date(9.99e10);
//   let deckCard: DeckCard | null = null;
//
//   return new Promise((resolve, reject) => {
//     deckObjectStore.openKeyCursor().onsuccess = (e: any) => {
//       let cursor = e.target.value;
//
//       if (!cursor) {
//         console.log('cursor ends');
//         return;
//       }
//
//       const deck: DeckCard = cursor.value;
//
//       if (deck.reviewAt < earliest) {
//         earliest = deck.reviewAt;
//         deckCard = deck;
//         cursor.continue();
//       }
//
//       const randomDays = Math.floor(Math.random() * 5);
//       const updated = new Date().setDate(new Date().getDate() + randomDays);
//       const deckCardRequest = deckObjectStore.put({
//         ...deckCard,
//         reviewAt: updated
//       })
//
//       deckCardRequest.onerror = () => {
//         reject();
//       }
//
//       deckCardRequest.onsuccess = () => {
//         if (deckCard !== null) {
//           const cardRequest = cardObjectStore.get(deckCard.cardId)
//
//           cardRequest.onerror = () => {
//             reject();
//           }
//
//           cardRequest.onsuccess = (e) => {
//             // @ts-ignore
//             const card = e.target.value;
//             resolve(card);
//           }
//         }
//         resolve(null);
//       }
//
//     };
//   })
// };
