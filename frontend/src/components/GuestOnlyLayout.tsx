import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { PATH_AFTER_AUTH } from '../routes/paths';
import Loading from './Loading';

const GuestOnlyLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to={PATH_AFTER_AUTH} replace />;
  }

  return <Outlet />;
};

export default GuestOnlyLayout;
