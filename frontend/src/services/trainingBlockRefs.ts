import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * **T-01-19:** Training blocks live in a subcollection under the owning user so rules can scope
 * access with `request.auth.uid == userId` from the path (`users/{userId}/trainingBlocks/{blockId}`).
 * Each document still includes `userId` for queries, client convenience, and defense in depth in rules.
 */
export const trainingBlocksCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'trainingBlocks');

export const trainingBlockDocRef = (userId: string, blockId: string) =>
  doc(db, 'users', userId, 'trainingBlocks', blockId);
