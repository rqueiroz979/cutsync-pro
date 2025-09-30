import { CheckCircle2, XCircle } from "lucide-react";

interface EmailValidatorProps {
  email: string;
  showValidation: boolean;
}

export function EmailValidator({ email, showValidation }: EmailValidatorProps) {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!email || !showValidation) return null;

  return (
    <div className="mt-1 flex items-center gap-2 text-xs">
      {isValidEmail ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-green-600 dark:text-green-400">E-mail válido</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 text-destructive" />
          <span className="text-destructive">Formato de e-mail inválido</span>
        </>
      )}
    </div>
  );
}