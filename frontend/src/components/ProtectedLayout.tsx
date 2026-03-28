import { Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { PATH_HOME } from '../routes/paths';
import Sidebar from './Sidebar';
import Loading from './Loading';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={PATH_HOME} replace />;
  }

  return (
    <Box sx={{ display: 'flex', flex: 1, minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
