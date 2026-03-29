import { AppBar, Box, CircularProgress, Link, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { PATH_AFTER_AUTH, PATH_LOGIN } from '../routes/paths';

const HomePage = () => {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to={PATH_AFTER_AUTH} replace />;
  }

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
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            <Link component={RouterLink} to={PATH_LOGIN} underline="hover">
              Sign in
            </Link>{' '}
            to continue.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
