import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const requirements = [
    {
      label: "Mínimo de 8 caracteres",
      met: password.length >= 8,
    },
    {
      label: "Uma letra maiúscula (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Uma letra minúscula (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      label: "Um número (0-9)",
      met: /[0-9]/.test(password),
    },
    {
      label: "Um caractere especial (!@#$%...)",
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];

  const strengthScore = requirements.filter(req => req.met).length;
  const strengthLabel = 
    strengthScore === 0 ? "" :
    strengthScore <= 2 ? "Fraca" :
    strengthScore <= 4 ? "Média" :
    "Forte";

  const strengthColor = 
    strengthScore === 0 ? "" :
    strengthScore <= 2 ? "text-destructive" :
    strengthScore <= 4 ? "text-yellow-500" :
    "text-green-500";

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {strengthLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Força da senha:</span>
          <span className={`text-sm font-semibold ${strengthColor}`}>{strengthLabel}</span>
        </div>
      )}
      
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-muted-foreground" />
            )}
            <span className={req.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
        <div 
          className={`h-1.5 rounded-full transition-all duration-300 ${
            strengthScore <= 2 ? "bg-destructive" :
            strengthScore <= 4 ? "bg-yellow-500" :
            "bg-green-500"
          }`}
          style={{ width: `${(strengthScore / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}