import React from "react";
import PropTypes from "prop-types";
import StepConnector from "@mui/material/StepConnector";
import Check from "@mui/icons-material/Check";
import "./QontoStepper.css";

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
