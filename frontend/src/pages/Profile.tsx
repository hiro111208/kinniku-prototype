import { Box, Toolbar, Typography, AppBar } from '@mui/material';

const Profile = () => {
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
            Profile
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Profile;
