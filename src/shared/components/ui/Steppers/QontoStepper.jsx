import React from "react";
import PropTypes from "prop-types";
import { cn } from "../../../../utils/cn";
import { Check } from "lucide-react";
import "./QontoStepper.css";

// ---------- CONNECTOR ----------
export const QontoConnector = ({ active, completed, className, ...props }) => (
  <div
    className={cn(
      "h-0.5 w-full transition-all duration-300",
      completed ? "bg-blue-600" : "bg-gray-300",
      "qonto-connector-line",
      active && "qonto-connector-line-active",
      completed && "qonto-connector-line-completed",
      className
    )}
    {...props}
  />
);

// ---------- STEP ICON ----------
export function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <div
      className={`qonto-step-icon ${active ? "qonto-step-icon-active" : ""} ${
        className || ""
      }`}
    >
      {completed ? (
        <Check size={18} className="qonto-step-icon-completed" />
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
