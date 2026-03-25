import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    setIsSubmitting(true);
    try {
      // TODO: Wire to `authService.login` in T-01-13.
      // For T-01-10, we just ensure the UI shows a proper loading state.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubmitError('Login is not connected yet. Please complete T-01-11/13.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 480,
          width: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight={600}>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              to continue to Kinniku
            </Typography>
          </Box>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="left">
              <Typography variant="subtitle1" fontWeight={500}>
                Enter your email
              </Typography>
            </Stack>
            <TextField
              fullWidth
              label="Email"
              size="small"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="left">
              <Typography variant="subtitle1" fontWeight={500}>
                Enter your password
              </Typography>
            </Stack>
            <TextField
              fullWidth
              label="Password"
              type="password"
              size="small"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </Stack>

          {submitError != null && (
            <Alert severity="error" onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Link component={RouterLink} to="/signup" underline="hover" variant="body2">
              Create an account instead
            </Link>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSubmitting ? 'Signing in…' : 'Next'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
