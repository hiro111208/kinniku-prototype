import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';

const HomePage = () => {
  const { user, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (!result.success) {
        setLogoutError(result.message);
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kinniku
          </Typography>
          {!loading && user != null && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              disabled={isLoggingOut}
              startIcon={isLoggingOut ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isLoggingOut ? 'Signing out…' : 'Log out'}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {logoutError != null && (
          <Alert severity="error" onClose={() => setLogoutError(null)} sx={{ mb: 2 }}>
            {logoutError}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress />
          </Box>
        ) : !user ? (
          <Typography variant="body1" color="text.secondary">
            <Link component={RouterLink} to="/login" underline="hover">
              Sign in
            </Link>{' '}
            to continue.
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            You&apos;re signed in.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
