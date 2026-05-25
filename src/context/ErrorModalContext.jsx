import { useCallback, useEffect, useMemo, useState } from "react";
import FeedbackDialog from "../components/feedback/FeedbackDialog/FeedbackDialog";
import { extractApiError, fieldErrorsFromDetails, titleForError } from "../utils/apiError";
import { setErrorModalHandler } from "../utils/errorModalBus";
import { ErrorModalContext } from "./errorModalContextInstance";

export function ErrorModalProvider({ children }) {
  const [errorState, setErrorState] = useState(null);

  const closeError = useCallback(() => setErrorState(null), []);

  const showApiError = useCallback((input) => {
    const error = extractApiError(input);
    setErrorState(error);
  }, []);

  useEffect(() => {
    setErrorModalHandler(showApiError);
    return () => setErrorModalHandler(null);
  }, [showApiError]);

  const value = useMemo(() => ({ showApiError, closeError }), [showApiError, closeError]);

  const isOpen = errorState !== null;
  const title = errorState ? titleForError(errorState) : "";
  const description = errorState?.message ?? "";
  const fieldErrors = errorState ? fieldErrorsFromDetails(errorState.details) : null;

  return (
    <ErrorModalContext.Provider value={value}>
      {children}
      <FeedbackDialog
        isOpen={isOpen}
        onClose={closeError}
        tone="danger"
        title={title}
        description={description}
        badge="Erro"
        size="sm"
        bodyClassName="mt-1"
      >
        {fieldErrors && fieldErrors.length > 0 && (
          <div className="rounded-lg border border-red-100 bg-red-50/60 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
              Campos com erro
            </p>
            <ul className="space-y-1 text-sm text-red-800">
              {fieldErrors.map(({ campo, mensagem }) => (
                <li key={campo}>
                  <span className="font-medium">{campo}:</span> {mensagem}
                </li>
              ))}
            </ul>
          </div>
        )}
        {errorState?.code && (
          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {errorState.code}
          </p>
        )}
      </FeedbackDialog>
    </ErrorModalContext.Provider>
  );
}

