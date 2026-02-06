import * as React from 'react';
import { Backdrop, CircularProgress } from '../../../components/ui/Utilities/Utilities';

export default function SimpleBackdrop() {
  const [open] = React.useState(false);
  return (
    <div>
      <Backdrop
        className="text-white z-[1300]"
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}