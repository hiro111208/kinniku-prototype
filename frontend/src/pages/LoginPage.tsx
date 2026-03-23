import { Box, Link, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

/** Placeholder until login is implemented (US-02). */
const LoginPage = () => {
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
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h5" component="h1" fontWeight={600}>
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Login will be available in a future update.
          </Typography>
          <Link component={RouterLink} to="/signup" underline="hover" variant="body2">
            Create an account instead
          </Link>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
