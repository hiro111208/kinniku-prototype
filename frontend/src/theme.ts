import { createTheme } from '@mui/material/styles';

export function createAppTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 100,
            minWidth: '85px',
            minHeight: '40px',
            fontSize: '14px',
          },
        },
      },
    },
  });
}
