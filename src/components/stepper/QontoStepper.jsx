import React from "react";
import PropTypes from "prop-types";
import StepConnector from "@mui/material/StepConnector";
import Check from "@mui/icons-material/Check";
import "./QontoStepper.css";

/**
 * Componentes customizados de Stepper no estilo Qonto para o MUI Stepper.
 *
 * `QontoConnector`  → conector estilizado entre os passos.
 * `QontoStepIcon`   → ícone do passo: círculo vazio (pendente), marcador ativo ou checkmark (concluído).
 *
 * Uso:
 *   <Stepper connector={<QontoConnector />}>
 *     <Step><StepLabel StepIconComponent={QontoStepIcon}>...</StepLabel></Step>
 *   </Stepper>
 */

// ─── Conector ────────────────────────────────────────────────────────
export const QontoConnector = (props) => (
  <StepConnector
    {...props}
    classes={{
      line: "qonto-connector-line",
      active: "qonto-connector-line-active",
      completed: "qonto-connector-line-completed",
    }}
  />
);

// ─── Ícone do passo ────────────────────────────────────────────────────
export function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <div
      className={`qonto-step-icon ${active ? "qonto-step-icon-active" : ""} ${
        className || ""
      }`}
    >
      {completed ? (
        <Check className="qonto-step-icon-completed" />
      ) : (
        <div className="qonto-step-icon-circle" />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};
