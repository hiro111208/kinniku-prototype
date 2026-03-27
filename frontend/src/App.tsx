import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { RouterProvider } from 'react-router';
import { createAppTheme } from './theme.ts';
import router from './router.tsx';

const App = () => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createAppTheme(prefersDark ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
