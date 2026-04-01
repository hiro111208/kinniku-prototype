import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router';

/**
 * Placeholder for **US-06** (full training plan details). Route: `/plans/:planId`.
 */
const TrainingPlanDetailPage = () => {
  const { planId } = useParams();

  return (
    <Box
      component="main"
      data-testid="training-plan-detail"
      sx={{ flex: 1, p: { xs: 2, sm: 3 } }}
    >
      <Typography variant="h5" component="h1" fontWeight={600} sx={{ mb: 1 }}>
        Training plan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Plan ID: {planId ?? '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Full details and weekly structure will appear here in a future update.
      </Typography>
    </Box>
  );
};

export default TrainingPlanDetailPage;
