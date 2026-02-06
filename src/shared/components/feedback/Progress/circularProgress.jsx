import * as React from 'react';
import { CircularProgress, Box } from '../../ui/Utilities/Utilities';

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}