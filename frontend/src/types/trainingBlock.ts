import type { Timestamp } from 'firebase/firestore';

/**
 * Firestore document for a training plan (conceptual **TRAINING_BLOCK** in `docs/er_diagram.md`).
 * Stored under `users/{userId}/trainingBlocks/{blockId}` (see `trainingBlockRefs.ts`).
 *
 * ER field mapping (conceptual → stored):
 * - `user_id` → `userId`
 * - `name` → `name`
 * - `start_date` → `startDate` (`Timestamp`, start of calendar day in the user’s timezone is enforced at validation/UI layer)
 * - `end_date` → `endDate`
 * - `planned_days_per_week` → `plannedDaysPerWeek`
 *
 * `description` is product-only (not on the ER); `createdAt` / `updatedAt` are implementation metadata for **US-05** ordering.
 */
export type TrainingBlockFirestore = {
  userId: string;
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  plannedDaysPerWeek: number;
  description?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
