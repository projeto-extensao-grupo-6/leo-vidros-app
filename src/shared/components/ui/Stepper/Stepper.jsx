import React from "react";
import { cn } from "../../../../utils/cn";
import { Check } from "lucide-react";

/**
 * Stepper Component - Componente de steps customizado com Tailwind
 */

export const Stepper = ({ 
  activeStep = 0, 
  alternativeLabel = false,
  connector,
  children,
  className,
  ...props 
}) => {
  const steps = React.Children.toArray(children);

  return (
    <div 
      className={cn(
        "flex items-center flex-row w-full",
        className
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            {React.cloneElement(step, {
              index,
              active: isActive,
              completed: isCompleted,
            })}
            {!isLast && connector && (
              <div className={cn("flex-1", alternativeLabel ? "h" : "mx-2")}>
                {React.cloneElement(connector, { active: isActive, completed: isCompleted })}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const Step = ({ 
  children, 
  active, 
  completed, 
  index,
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-2",
        className
      )}
      {...props}
    >
      {children && React.cloneElement(children, { active, completed, index })}
    </div>
  );
};

export const StepLabel = ({ 
  children, 
  StepIconComponent,
  active, 
  completed,
  index,
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center gap-2",
        className
      )}
      {...props}
    >
      {StepIconComponent ? (
        <StepIconComponent active={active} completed={completed} />
      ) : (
        <StepIcon active={active} completed={completed}>
          {completed ? <Check size={16} /> : index + 1}
        </StepIcon>
      )}
      <span 
        className={cn(
          "text-sm font-medium transition-colors",
          active && "text-blue-600",
          completed && "text-blue-600",
          !active && !completed && "text-gray-500"
        )}
      >
        {children}
      </span>
    </div>
  );
};

export const StepIcon = ({ active, completed, children, className }) => {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
        completed && "bg-blue-600 text-white",
        active && !completed && "bg-blue-100 text-blue-600 ring-2 ring-blue-600",
        !active && !completed && "bg-gray-200 text-gray-600",
        className
      )}
    >
      {children}
    </div>
  );
};

export const StepConnector = ({ active, completed, className, ...props }) => {
  return (
    <div
      className={cn(
        "h-0.5 w-full transition-colors",
        completed ? "bg-blue-600" : "bg-gray-300",
        className
      )}
      {...props}
    />
  );
};

// Versão customizada com estilo Qonto (já existente no projeto)
export const QontoConnector = ({ active, completed, className }) => {
  return (
    <div
      className={cn(
        "h-0.5 w-full transition-all duration-300",
        completed ? "bg-blue-600" : "bg-gray-300",
        className
      )}
    />
  );
};

export const QontoStepIcon = ({ active, completed, className }) => {
  return (
    <div
      className={cn(
        "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
        completed && "bg-blue-600",
        active && !completed && "bg-blue-600",
        !active && !completed && "bg-gray-300",
        className
      )}
    >
      {completed ? (
        <Check size={20} className="text-white" />
      ) : (
        <div className={cn(
          "w-3 h-3 rounded-full",
          active ? "bg-white" : "bg-white"
        )} />
      )}
    </div>
  );
};

export default Stepper;
