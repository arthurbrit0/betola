"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PasswordConfirmInputProps {
  passwordToMatch: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const PasswordConfirmInput: React.FC<PasswordConfirmInputProps> = ({
  passwordToMatch,
  value,
  onChange,
  placeholder = "Confirm your password",
  error,
}) => {
  const [shake, setShake] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (
      value.length < newValue.length &&
      !passwordToMatch.startsWith(newValue)
    ) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };
  
  const passwordsMatch = passwordToMatch === value && value.length > 0;

  const bounceAnimation = {
    x: shake ? [-10, 10, -5, 5, 0] : 0,
    transition: { duration: 0.5 },
  };

  const matchAnimation = {
    scale: passwordsMatch ? [1, 1.02, 1] : 1,
    transition: { duration: 0.3 },
  };

  return (
    <motion.div
      className="w-full"
      animate={{ ...bounceAnimation, ...matchAnimation }}
    >
      <input
        className={cn(
          "h-12 w-full rounded-lg border-2 bg-background px-4 py-3",
          "text-foreground outline-none placeholder:text-muted-foreground",
          "transition-colors duration-300",
          error
            ? "border-destructive focus:border-destructive"
            : passwordsMatch
            ? "border-green-500 focus:border-green-500"
            : "border-border focus:border-primary"
        )}
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
    </motion.div>
  );
}; 