import React from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import "./inputText.component.css"

export default function InputText({ id, label, type = "text", value, onChange, icon }) {
  return (
    <FormControl variant="standard"
      className="formControl">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        startAdornment={
          icon ? <InputAdornment position="start">{icon}</InputAdornment> : null
        }
      />
    </FormControl>
  );
}
