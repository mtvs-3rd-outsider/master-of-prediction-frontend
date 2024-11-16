// app/global-error.tsx
"use client";
import ErrorBoundary from "../components/ErrorBoundary";

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error, reset }) => {
  return <ErrorBoundary error={error} reset={reset} />;
};

export default GlobalError;
