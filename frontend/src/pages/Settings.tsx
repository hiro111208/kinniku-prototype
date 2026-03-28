import { AppBar, Toolbar, Box } from '@mui/material';
import { Typography } from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Settings;
