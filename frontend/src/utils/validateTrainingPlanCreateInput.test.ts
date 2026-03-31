import { describe, expect, it } from 'vitest';
import { validateTrainingPlanCreateInput } from './validateTrainingPlanCreateInput.ts';

const validBase = () => ({
  name: ' Strength block ',
  startDate: '2026-06-01',
  endDate: '2026-08-31',
  plannedDaysPerWeek: 4,
  description: ' Optional notes ',
});

describe('validateTrainingPlanCreateInput', () => {
  it('accepts valid input and trims name / description', () => {
    const result = validateTrainingPlanCreateInput(validBase());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({
      name: 'Strength block',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      plannedDaysPerWeek: 4,
      description: 'Optional notes',
    });
  });

  it('allows end date equal to start date', () => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      startDate: '2026-01-15',
      endDate: '2026-01-15',
    });
    expect(result.ok).toBe(true);
  });

  it('rejects empty name', () => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      name: '   ',
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('rejects invalid start date string', () => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      startDate: 'not-a-date',
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'startDate')).toBe(true);
  });

  it('rejects invalid calendar day (month overflow)', () => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      startDate: '2026-02-31',
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'startDate')).toBe(true);
  });

  it('rejects end date before start date', () => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      startDate: '2026-06-10',
      endDate: '2026-06-09',
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'endDate')).toBe(true);
  });

  it.each([
    [0, false],
    [8, false],
    [3.5, false],
    [NaN, false],
    [1, true],
    [7, true],
  ])('plannedDaysPerWeek %s → ok=%s', (pdw, ok) => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      plannedDaysPerWeek: pdw as number,
    });
    expect(result.ok).toBe(ok);
  });

  it('accepts Date objects and normalizes to YYYY-MM-DD', () => {
    const result = validateTrainingPlanCreateInput({
      name: 'Block',
      startDate: new Date(2026, 5, 1),
      endDate: new Date(2026, 7, 31),
      plannedDaysPerWeek: 3,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.startDate).toBe('2026-06-01');
    expect(result.value.endDate).toBe('2026-08-31');
  });

  it('treats empty or whitespace description as null', () => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      description: '  ',
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.description).toBeNull();
  });

  it('rejects description over max length', () => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      description: 'x'.repeat(5001),
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'description')).toBe(true);
  });

  it('accepts description at max length', () => {
    const result = validateTrainingPlanCreateInput({
      ...validBase(),
      description: 'x'.repeat(5000),
    });
    expect(result.ok).toBe(true);
  });
});
