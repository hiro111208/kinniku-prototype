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
import { signUp } from '../services/authService';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    displayName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const MIN_PASSWORD_LENGTH = 8;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = {
    firstName: !firstName.trim() ? 'First name is required' : '',
    displayName: !displayName.trim() ? 'Display name is required' : '',
    email: !email.trim()
      ? 'Email is required'
      : !EMAIL_REGEX.test(email.trim())
        ? 'Email is invalid'
        : '',
    password: !password
      ? 'Password is required'
      : password.length < MIN_PASSWORD_LENGTH
        ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
        : '',
    confirmPassword: !confirmPassword
      ? 'Please confirm your password'
      : confirmPassword !== password
        ? 'Passwords do not match'
        : '',
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setTouched({
      firstName: true,
      lastName: true,
      displayName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const hasErrors = Object.values(errors).some(Boolean);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    const name =
      [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || displayName.trim();
    const result = await signUp(email.trim(), password, name || displayName.trim() || undefined);

    setIsSubmitting(false);

    if (result.success) {
      // T-01-08 will add redirect to onboarding/plans
      return;
    }

    setSubmitError(result.message);
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
          {/* App logo / title */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight={600}>
              Create a Kinniku Account
            </Typography>
          </Box>

          {/* Name fields */}
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="left">
              <Typography variant="subtitle1" fontWeight={500}>
                Enter your name
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="First name"
                size="small"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                onBlur={() => handleBlur('firstName')}
                error={touched.firstName && !!errors.firstName}
                helperText={touched.firstName ? errors.firstName : ''}
              />
              <TextField
                fullWidth
                label="Last name"
                size="small"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                onBlur={() => handleBlur('lastName')}
              />
            </Stack>
          </Stack>

          {/* Display name / username */}
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="left">
              <Typography variant="subtitle1" fontWeight={500}>
                Choose your display name
              </Typography>
            </Stack>
            <TextField
              fullWidth
              label="Display name"
              size="small"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              onBlur={() => handleBlur('displayName')}
              error={touched.displayName && !!errors.displayName}
              helperText={touched.displayName ? errors.displayName : ''}
            />
          </Stack>

          {/* Email field*/}
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
              onBlur={() => handleBlur('email')}
              error={touched.email && !!errors.email}
              helperText={touched.email ? errors.email : ''}
            />
          </Stack>

          {/* Password fields */}
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="left">
              <Typography variant="subtitle1" fontWeight={500}>
                Create a strong password
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                size="small"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password && !!errors.password}
                helperText={touched.password ? errors.password : ''}
              />
              <TextField
                fullWidth
                label="Confirm"
                type="password"
                size="small"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword ? errors.confirmPassword : ''}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Use 8 or more characters with a mix of letters, numbers &amp; symbols.
            </Typography>
          </Stack>

          {submitError != null && (
            <Alert severity="error" onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {/* Footer actions */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Link component={RouterLink} to="/login" underline="hover" variant="body2">
              Sign in instead
            </Link>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSubmitting ? 'Creating account…' : 'Next'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SignupPage;
