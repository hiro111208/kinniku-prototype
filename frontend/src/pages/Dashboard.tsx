import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { PATH_PLANS_NEW } from '../routes/paths';

const Dashboard = () => {
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
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ px: 2, pb: 3, pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Training plans you create will appear in a list view in a future update.
        </Typography>
        <Button component={RouterLink} to={PATH_PLANS_NEW} variant="contained">
          New training plan
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
