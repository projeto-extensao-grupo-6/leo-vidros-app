import React from 'react';
import { CircularProgress, Box, Typography } from '../ui/Utilities/Utilities';

const PageLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 2
      }}
    >
      <CircularProgress size={50} />
      <Typography variant="body1" color="text.secondary">
        Carregando...
      </Typography>
    </Box>
  );
};

export default PageLoader;
