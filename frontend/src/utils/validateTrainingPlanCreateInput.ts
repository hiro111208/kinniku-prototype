const DESCRIPTION_MAX_LENGTH = 5000;

export type TrainingPlanCreateInput = {
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  plannedDaysPerWeek: number;
  description?: string | null;
};

export type TrainingPlanCreateField = keyof TrainingPlanCreateInput;

export type TrainingPlanCreateValidationIssue = {
  field: TrainingPlanCreateField;
  message: string;
};

/** Normalized create payload after validation (date-only strings from the user’s calendar). */
export type ValidatedTrainingPlanCreateInput = {
  name: string;
  startDate: string;
  endDate: string;
  plannedDaysPerWeek: number;
  description: string | null;
};

export type ValidateTrainingPlanCreateInputResult =
  | { ok: true; value: ValidatedTrainingPlanCreateInput }
  | { ok: false; errors: TrainingPlanCreateValidationIssue[] };

function toLocalDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseCalendarDate(value: string | Date): Date | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return toLocalDateOnly(value);
  }
  const s = value.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const day = Number(m[3]);
  const dt = new Date(y, mo - 1, day);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== day) {
    return null;
  }
  return dt;
}

function formatDateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const validateTrainingPlanCreateInput = (
  input: TrainingPlanCreateInput
): ValidateTrainingPlanCreateInputResult => {
  const errors: TrainingPlanCreateValidationIssue[] = [];

  const name = input.name.trim();
  if (!name) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }

  const start = parseCalendarDate(input.startDate);
  if (!start) {
    errors.push({ field: 'startDate', message: 'Enter a valid start date.' });
  }

  const end = parseCalendarDate(input.endDate);
  if (!end) {
    errors.push({ field: 'endDate', message: 'Enter a valid end date.' });
  }

  if (start && end && end.getTime() < start.getTime()) {
    errors.push({
      field: 'endDate',
      message: 'End date must be on or after the start date.',
    });
  }

  const pdw = input.plannedDaysPerWeek;
  if (
    typeof pdw !== 'number' ||
    Number.isNaN(pdw) ||
    !Number.isInteger(pdw) ||
    pdw < 1 ||
    pdw > 7
  ) {
    errors.push({
      field: 'plannedDaysPerWeek',
      message: 'Planned days per week must be a whole number from 1 to 7.',
    });
  }

  let description: string | null = null;
  if (input.description != null && String(input.description).trim() !== '') {
    const d = String(input.description).trim();
    if (d.length > DESCRIPTION_MAX_LENGTH) {
      errors.push({
        field: 'description',
        message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters.`,
      });
    } else {
      description = d;
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      startDate: formatDateOnly(start!),
      endDate: formatDateOnly(end!),
      plannedDaysPerWeek: pdw,
      description,
    },
  };
};
