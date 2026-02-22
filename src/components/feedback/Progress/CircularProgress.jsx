import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * Indicador de carregamento circular indeterminado (MUI).
 * Usado em telas de loading ou enquanto operações assíncronas estão em andamento.
 */
export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}