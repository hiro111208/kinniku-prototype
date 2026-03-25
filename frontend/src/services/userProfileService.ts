import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export type InitialUserProfileInput = {
  name: string;
  email: string;
};

/** Creates `users/{userId}` with fields aligned to the USER entity (gender/bodyweight filled later). */
export const createInitialUserProfile = async (
  userId: string,
  input: InitialUserProfileInput
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    id: userId,
    name: input.name,
    email: input.email,
    gender: null,
    bodyweight: null,
    createdAt: serverTimestamp(),
  });
};
