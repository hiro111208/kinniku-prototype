import { Typography, Box, Toolbar, AppBar } from '@mui/material';

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
    </Box>
  );
};

export default Dashboard;
