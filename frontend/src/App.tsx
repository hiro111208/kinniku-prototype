import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SignupPage from './pages/SignupPage.tsx';
import { createAppTheme } from './theme.ts';

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createAppTheme(prefersDark ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <SignupPage />
    </ThemeProvider>
  );
}

export default App;
