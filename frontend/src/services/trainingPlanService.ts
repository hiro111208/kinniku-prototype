import { addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth } from './firebase';
import { trainingBlocksCollectionRef } from './trainingBlockRefs';
import { logAppError } from '../utils/clientLog';
import {
  validateTrainingPlanCreateInput,
  type TrainingPlanCreateInput,
  type TrainingPlanCreateValidationIssue,
} from '../utils/validateTrainingPlanCreateInput';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

const FIRESTORE_WRITE_ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': 'You do not have permission to save this plan. Try signing in again.',
  unavailable: 'Service temporarily unavailable. Try again in a moment.',
  'resource-exhausted': 'Too many requests. Please try again later.',
  cancelled: 'Request was cancelled. Please try again.',
  'failed-precondition': 'Could not save the plan. Please try again.',
};

const getFirestoreWriteErrorMessage = (error: unknown): string => {
  const code =
    typeof error === 'object' && error != null && 'code' in error
      ? String((error as { code: string }).code)
      : undefined;
  if (code != null && FIRESTORE_WRITE_ERROR_MESSAGES[code] != null) {
    return FIRESTORE_WRITE_ERROR_MESSAGES[code];
  }
  return DEFAULT_ERROR_MESSAGE;
};

function dateOnlyStringToTimestamp(ymd: string): Timestamp {
  const [y, m, d] = ymd.split('-').map(Number);
  return Timestamp.fromDate(new Date(y, m - 1, d));
}

export type CreateTrainingPlanResult =
  | { success: true; blockId: string }
  | {
      success: false;
      message: string;
      validationErrors?: TrainingPlanCreateValidationIssue[];
    };

const create = async (input: TrainingPlanCreateInput): Promise<CreateTrainingPlanResult> => {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, message: 'You must be signed in to create a training plan.' };
  }

  const validated = validateTrainingPlanCreateInput(input);
  if (!validated.ok) {
    return {
      success: false,
      message: validated.errors[0]?.message ?? 'Invalid training plan.',
      validationErrors: validated.errors,
    };
  }

  const v = validated.value;

  try {
    const docRef = await addDoc(trainingBlocksCollectionRef(user.uid), {
      userId: user.uid,
      name: v.name,
      startDate: dateOnlyStringToTimestamp(v.startDate),
      endDate: dateOnlyStringToTimestamp(v.endDate),
      plannedDaysPerWeek: v.plannedDaysPerWeek,
      description: v.description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, blockId: docRef.id };
  } catch (error) {
    logAppError('trainingPlanService.create', error);
    return { success: false, message: getFirestoreWriteErrorMessage(error) };
  }
};

export const trainingPlanService = {
  create,
};
