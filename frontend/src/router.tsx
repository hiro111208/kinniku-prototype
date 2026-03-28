import { createBrowserRouter, Navigate } from 'react-router';
import GuestOnlyLayout from './components/GuestOnlyLayout.tsx';
import ProtectedLayout from './components/ProtectedLayout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import Profile from './pages/Profile.tsx';
import Settings from './pages/Settings.tsx';
import SignupPage from './pages/SignupPage.tsx';
import {
  PATH_DASHBOARD,
  PATH_HOME,
  PATH_LOGIN,
  PATH_PROFILE,
  PATH_SETTINGS,
  PATH_SIGNUP,
} from './routes/paths.ts';

const router = createBrowserRouter([
  { path: PATH_HOME, element: <HomePage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: PATH_DASHBOARD, element: <Dashboard /> },
      { path: PATH_PROFILE, element: <Profile /> },
      { path: PATH_SETTINGS, element: <Settings /> },
    ],
  },
  {
    element: <GuestOnlyLayout />,
    children: [
      { path: PATH_LOGIN, element: <LoginPage /> },
      { path: PATH_SIGNUP, element: <SignupPage /> },
    ],
  },
  { path: '/home', element: <Navigate to={PATH_HOME} replace /> },
  { path: '*', element: <Navigate to={PATH_HOME} replace /> },
]);

export default router;
