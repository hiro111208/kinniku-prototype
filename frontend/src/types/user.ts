/** App-level USER profile (Firestore + domain model). */
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  gender: string | null;
  bodyweight: number | null;
};
