import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { pathToTrainingPlan } from '../routes/paths';
import { trainingPlanService } from '../services/trainingPlanService';
import {
  validateTrainingPlanCreateInput,
  type TrainingPlanCreateField,
} from '../utils/validateTrainingPlanCreateInput';

export type CreateTrainingPlanPageProps = {
  /** When set (e.g. in tests), called instead of navigating after a successful create. */
  onCreateSuccess?: (blockId: string) => void;
};

const CreateTrainingPlanPage = ({ onCreateSuccess }: CreateTrainingPlanPageProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [plannedDaysPerWeek, setPlannedDaysPerWeek] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TrainingPlanCreateField, string>>
  >({});

  const clearFieldError = (field: TrainingPlanCreateField) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const pdwNum = plannedDaysPerWeek.trim() === '' ? NaN : Number(plannedDaysPerWeek);

    const validation = validateTrainingPlanCreateInput({
      name,
      startDate,
      endDate,
      plannedDaysPerWeek: pdwNum,
      description: description.trim() === '' ? null : description,
    });

    if (!validation.ok) {
      const next: Partial<Record<TrainingPlanCreateField, string>> = {};
      for (const err of validation.errors) {
        next[err.field] = err.message;
      }
      setFieldErrors(next);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const result = await trainingPlanService.create({
      name,
      startDate,
      endDate,
      plannedDaysPerWeek: pdwNum,
      description: description.trim() === '' ? null : description.trim(),
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.message);
      return;
    }

    if (onCreateSuccess != null) {
      onCreateSuccess(result.blockId);
      return;
    }

    navigate(pathToTrainingPlan(result.blockId));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: 560,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" component="h1" fontWeight={600}>
              New training plan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Name your block, set dates, and how many days per week you intend to train.
            </Typography>
          </Box>

          <TextField
            required
            fullWidth
            label="Plan name"
            size="small"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError('name');
            }}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            inputProps={{ 'aria-label': 'Plan name' }}
          />

          <TextField
            fullWidth
            label="Description"
            size="small"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearFieldError('description');
            }}
            error={!!fieldErrors.description}
            helperText={fieldErrors.description ?? 'Optional'}
            multiline
            minRows={3}
            inputProps={{ 'aria-label': 'Description' }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              required
              fullWidth
              label="Start date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                clearFieldError('startDate');
              }}
              error={!!fieldErrors.startDate}
              helperText={fieldErrors.startDate}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 'aria-label': 'Start date' }}
            />
            <TextField
              required
              fullWidth
              label="End date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                clearFieldError('endDate');
              }}
              error={!!fieldErrors.endDate}
              helperText={fieldErrors.endDate}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 'aria-label': 'End date' }}
            />
          </Stack>

          <TextField
            required
            fullWidth
            label="Planned days per week"
            type="number"
            size="small"
            value={plannedDaysPerWeek}
            onChange={(e) => {
              setPlannedDaysPerWeek(e.target.value);
              clearFieldError('plannedDaysPerWeek');
            }}
            error={!!fieldErrors.plannedDaysPerWeek}
            helperText={fieldErrors.plannedDaysPerWeek ?? 'Whole number from 1 to 7'}
            inputProps={{ min: 1, max: 7, step: 1, 'aria-label': 'Planned days per week' }}
          />

          {submitError != null && (
            <Alert severity="error" onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSubmitting ? 'Creating…' : 'Create plan'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreateTrainingPlanPage;
