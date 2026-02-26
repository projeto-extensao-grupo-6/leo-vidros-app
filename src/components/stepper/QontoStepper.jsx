import React from "react";
import PropTypes from "prop-types";
import StepConnector from "@mui/material/StepConnector";
import { Check } from "lucide-react"; // Corrigido para importação nomeada e PascalCase

export const QontoConnector = (props) => (
  <StepConnector
    {...props}
    classes={{
      line: "border-t-[3px] rounded-[1px] h-[3px] bg-[var(--color-background)] relative overflow-hidden after:content-[''] after:absolute after:top-0 after:left-0 after:h-full after:w-0 after:bg-[var(--button-color)] after:transition-[width] after:duration-[600ms] after:ease-in-out",
      active: "after:w-full",
      completed: "after:w-full",
    }}
  />
);

export function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <div
      className={`flex h-[22px] items-center text-[#eaeaf0] ${
        active ? "text-[var(--button-color)]" : ""
      } ${className || ""}`}
    >
      {completed ? (
        <Check className="text-[var(--button-color)] w-[18px] h-[18px]" />
      ) : (
        <div className="w-2 h-2 rounded-full bg-current" />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};
