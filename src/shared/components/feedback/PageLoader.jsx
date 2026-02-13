import React from 'react';
import { CircularProgress, Box, Typography } from '../ui/Utilities/Utilities';

const PageLoader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        gap: 3
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h5" color="text.primary" sx={{ fontWeight: 500 }}>
        Carregando...
      </Typography>
    </Box>
  );
};

export default PageLoader;
