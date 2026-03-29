import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import ProfileIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, CircularProgress, Link, Stack } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import { PATH_AFTER_AUTH, PATH_DASHBOARD, PATH_HOME, PATH_PROFILE, PATH_SETTINGS } from '../routes/paths';
import { logout } from '../services/authService';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (result.success) {
        navigate(PATH_HOME, { replace: true });
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box
      sx={{
        width: 200,
        minHeight: '100vh',
        bgcolor: 'background.paper',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 2,
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <HomeIcon fontSize="small" />
        <Link component={RouterLink} to={PATH_AFTER_AUTH}>
          Home
        </Link>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <DashboardIcon fontSize="small" />
        <Link component={RouterLink} to={PATH_DASHBOARD}>
          Dashboard
        </Link>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <ProfileIcon fontSize="small" />
        <Link component={RouterLink} to={PATH_PROFILE}>
          Profile
        </Link>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <SettingsIcon fontSize="small" />
        <Link component={RouterLink} to={PATH_SETTINGS}>
          Settings
        </Link>
      </Stack>

      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={isLoggingOut ? <CircularProgress size={14} color="inherit" /> : <LogoutIcon />}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Signing out…' : 'Log out'}
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
