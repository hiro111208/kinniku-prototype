import { Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';

const SignupPage = () => {
  return (
    <Box
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
              <TextField fullWidth label="First name" size="small" />
              <TextField fullWidth label="Last name" size="small" />
            </Stack>
          </Stack>

          {/* Display name / username */}
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="left">
              <Typography variant="subtitle1" fontWeight={500}>
                Choose your display name
              </Typography>
            </Stack>
            <TextField fullWidth label="Display name" size="small" />
          </Stack>

          {/* Password fields */}
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="left">
              <Typography variant="subtitle1" fontWeight={500}>
                Create a strong password
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Password" type="password" size="small" />
              <TextField fullWidth label="Confirm" type="password" size="small" />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Use 8 or more characters with a mix of letters, numbers &amp; symbols.
            </Typography>
          </Stack>

          {/* Footer actions */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Link href="#" underline="hover" variant="body2">
              Sign in instead
            </Link>
            <Button variant="contained">Next</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SignupPage;
