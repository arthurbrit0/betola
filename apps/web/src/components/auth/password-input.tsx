"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const passwordRequirements = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Number", test: (v: string) => /\d/.test(v) },
  { label: "Lowercase", test: (v: string) => /[a-z]/.test(v) },
  { label: "Uppercase", test: (v: string) => /[A-Z]/.test(v) },
  {
    label: "Special (!@#$)",
    test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  },
] as const;

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showRequirements?: boolean;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your password",
  showRequirements = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (value: string): number => {
    if (!value) return 0;
    return passwordRequirements.filter((req) => req.test(value)).length * 20;
  };

  const strength = getStrength(value);
  const strengthLabel = strength <= 40 ? "Weak" : strength <= 80 ? "Medium" : "Strong";

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2 pr-10",
            "rounded-lg border",
            "bg-background",
            "border-border",
            "focus:outline-none focus:ring-2",
            "focus:ring-ring",
            "text-foreground",
            error && "border-destructive"
          )}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2
            text-muted-foreground hover:text-foreground
            transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {value && showRequirements && (
        <div className="space-y-2">
          <div className="h-1 w-full bg-muted rounded-full">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${strength}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Strength: <span className="font-medium">{strengthLabel}</span>
          </p>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            {passwordRequirements.map(({ label, test }) => (
              <div key={label} className="flex items-center gap-2">
                {test(value) ? (
                  <CheckIcon className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                <span className={test(value) ? "text-green-600" : ""}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 