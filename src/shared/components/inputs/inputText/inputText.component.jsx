import React from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import "./inputText.component.css";

// Componente de máscara customizada para IMaskInput
const MaskedInput = React.forwardRef(function MaskedInput(props, ref) {
  const { mask, onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={mask}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

MaskedInput.propTypes = {
  mask: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default function InputText({
  id,
  label,
  icon,
  mask,
  ...rest
}) {
  return (
    <FormControl variant="standard" className="formControl input-spacing">
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Input
        id={id}
        {...rest}
        startAdornment={
          icon ? <InputAdornment position="start">{icon}</InputAdornment> : null
        }
        inputComponent={mask ? MaskedInput : undefined}
        inputProps={mask ? { mask } : undefined}
      />
    </FormControl>
  );
}

