import { addDoc, Timestamp } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trainingPlanService } from './trainingPlanService.ts';

vi.mock('./firebase.ts', () => {
  const state = { currentUser: { uid: 'user-uid-1' } as { uid: string } | null };
  return {
    auth: {
      get currentUser() {
        return state.currentUser;
      },
    },
    db: {},
    __setMockUser: (u: { uid: string } | null) => {
      state.currentUser = u;
    },
  };
});

vi.mock('./trainingBlockRefs.ts', () => ({
  trainingBlocksCollectionRef: vi.fn((uid: string) => `trainingBlocksRef:${uid}`),
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    addDoc: vi.fn(),
  };
});

vi.mock('../utils/clientLog.ts', () => ({
  logAppError: vi.fn(),
}));

const validInput = {
  name: 'Summer block',
  startDate: '2026-06-01',
  endDate: '2026-08-31',
  plannedDaysPerWeek: 4,
  description: null as string | null,
};

function ts(ymd: string): Timestamp {
  const [y, m, d] = ymd.split('-').map(Number);
  return Timestamp.fromDate(new Date(y, m - 1, d));
}

describe('trainingPlanService.create', () => {
  beforeEach(async () => {
    vi.mocked(addDoc).mockReset();
    const firebaseMod = await import('./firebase.ts');
    (firebaseMod as unknown as { __setMockUser: (u: { uid: string } | null) => void }).__setMockUser({
      uid: 'user-uid-1',
    });
    vi.mocked(addDoc).mockResolvedValue({ id: 'new-block-id' } as Awaited<ReturnType<typeof addDoc>>);
  });

  it('returns failure when there is no signed-in user and does not call addDoc', async () => {
    const firebaseMod = await import('./firebase.ts');
    (firebaseMod as unknown as { __setMockUser: (u: { uid: string } | null) => void }).__setMockUser(
      null
    );

    const result = await trainingPlanService.create(validInput);

    expect(result).toEqual({
      success: false,
      message: 'You must be signed in to create a training plan.',
    });
    expect(addDoc).not.toHaveBeenCalled();
  });

  it('returns validation failure and does not call addDoc when input is invalid', async () => {
    const result = await trainingPlanService.create({
      ...validInput,
      name: '   ',
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.validationErrors).toBeDefined();
    expect(addDoc).not.toHaveBeenCalled();
  });

  it('writes validated fields and timestamps and returns the new document id', async () => {
    const result = await trainingPlanService.create({
      ...validInput,
      description: 'Notes here',
    });

    expect(result).toEqual({ success: true, blockId: 'new-block-id' });

    expect(addDoc).toHaveBeenCalledTimes(1);
    const [colRef, data] = vi.mocked(addDoc).mock.calls[0];
    expect(colRef).toBe('trainingBlocksRef:user-uid-1');

    expect(data.userId).toBe('user-uid-1');
    expect(data.name).toBe('Summer block');
    expect(data.plannedDaysPerWeek).toBe(4);
    expect(data.description).toBe('Notes here');
    expect((data.startDate as Timestamp).isEqual(ts('2026-06-01'))).toBe(true);
    expect((data.endDate as Timestamp).isEqual(ts('2026-08-31'))).toBe(true);
    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
  });

  it('maps Firestore errors to a safe message', async () => {
    vi.mocked(addDoc).mockRejectedValueOnce({ code: 'permission-denied' });

    const result = await trainingPlanService.create(validInput);

    expect(result).toEqual({
      success: false,
      message: 'You do not have permission to save this plan. Try signing in again.',
    });
  });
});
