/**
 * Componentes UI Customizados - Substituição completa do Material-UI
 * Todos os componentes foram criados com Tailwind CSS usando as cores da aplicação
 */

// Table Components
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
} from "./Table/Table";

// Stepper Components
export {
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  StepConnector,
  QontoConnector,
  QontoStepIcon,
} from "./Stepper/Stepper";

// Modal Components
export {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  Box,
} from "./Modal/Modal";

// Form Components
export { Chip } from "./Chip/Chip";
export { IconButton } from "./IconButton/IconButton";
export { Checkbox } from "./Checkbox/Checkbox";
export { default as Input } from "./Input";
export { default as MaskedInput } from "./MaskedInput/MaskedInput";
export { default as Button } from "./buttons/button.component";

// Utility Components
export {
  Spinner,
  CircularProgress,
  Paper,
  Divider,
  Collapse,
  Typography,
  Backdrop,
} from "./Utilities/Utilities";

// Common Components
export { default as ErrorBoundary } from "../common/ErrorBoundary";

// Form Helper Components
export { Switch } from "./Switch/Switch";
export { FormControlLabel } from "./FormControlLabel/FormControlLabel";
export { Avatar } from "./Avatar/Avatar";
export { MenuItem } from "./MenuItem/MenuItem";
export { Stack } from "./Stack/Stack";
export { Grid } from "./Grid/Grid";
