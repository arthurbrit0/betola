"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Loader2, Mail, User, Lock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Label,
  P,
  H1,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@betola/ui";
import { API_URL } from '@/lib/api';

interface FormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: ''
  });

  const router = useRouter();

  const validateEmail = (email: string): ValidationState => {
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    return { isValid: true, message: '' };
  };

  const validateUsername = (username: string): ValidationState => {
    if (!username) {
      return { isValid: false, message: 'Username is required' };
    }
    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters' };
    }
    if (username.length > 20) {
      return { isValid: false, message: 'Username must be less than 20 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    return { isValid: true, message: '' };
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: '', color: '' };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengthMap = {
      0: { label: 'Very Weak', color: 'bg-red-500' },
      1: { label: 'Weak', color: 'bg-red-400' },
      2: { label: 'Fair', color: 'bg-yellow-500' },
      3: { label: 'Good', color: 'bg-blue-500' },
      4: { label: 'Strong', color: 'bg-green-500' },
      5: { label: 'Very Strong', color: 'bg-green-600' }
    };

    return {
      score,
      label: strengthMap[score as keyof typeof strengthMap].label,
      color: strengthMap[score as keyof typeof strengthMap].color
    };
  };

  const validatePassword = (password: string): ValidationState => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true, message: '' };
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): ValidationState => {
    if (!confirmPassword) {
      return { isValid: false, message: 'Please confirm your password' };
    }
    if (confirmPassword !== password) {
      return { isValid: false, message: 'Passwords do not match' };
    }
    return { isValid: true, message: '' };
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof FormData, value: string) => {
    let validation: ValidationState;
    
    switch (field) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'username':
        validation = validateUsername(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(value, formData.password);
        break;
      default:
        validation = { isValid: true, message: '' };
    }

    setErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? undefined : validation.message
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.message;
    
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) newErrors.username = usernameValidation.message;
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) newErrors.password = passwordValidation.message;
    
    const confirmPasswordValidation = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (!confirmPasswordValidation.isValid) newErrors.confirmPassword = confirmPasswordValidation.message;

    setErrors(newErrors);
    setTouched({
      email: true,
      username: true,
      password: true,
      confirmPassword: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldIcon = (field: keyof FormData) => {
    const hasError = errors[field] && touched[field];
    const isValid = !errors[field] && touched[field] && formData[field];
    
    if (hasError) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    if (isValid) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h1>
            <p className="text-muted-foreground">
              Welcome aboard! Please check your email to verify your account.
            </p>
          </div>
          <Button 
            onClick={() => setIsSuccess(false)}
            className="w-full"
          >
            Continue
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <H1>Criar Conta</H1>
          <P>Junte-se a nós hoje e comece sua jornada</P>
        </div>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <X className="h-4 w-4" />
            <AlertTitle>Erro no Registro</AlertTitle>
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`pl-10 pr-10 transition-colors ${
                  errors.email && touched.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : !errors.email && touched.email && formData.email
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
                placeholder="Enter your email"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getFieldIcon('email')}
              </div>
            </div>
            {errors.email && touched.email && (
              <p id="email-error" className="text-sm text-red-500" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                className={`pl-10 pr-10 transition-colors ${
                  errors.username && touched.username
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : !errors.username && touched.username && formData.username
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
                placeholder="Choose a username"
                aria-describedby={errors.username ? 'username-error' : undefined}
                aria-invalid={!!errors.username}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getFieldIcon('username')}
              </div>
            </div>
            {errors.username && touched.username && (
              <p id="username-error" className="text-sm text-red-500" role="alert">
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`pl-10 pr-20 transition-colors ${
                  errors.password && touched.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : !errors.password && touched.password && formData.password
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
                placeholder="Create a strong password"
                aria-describedby={errors.password ? 'password-error' : 'password-strength'}
                aria-invalid={!!errors.password}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {getFieldIcon('password')}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {formData.password && (
              <div id="password-strength" className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.score >= 4 ? 'text-green-600' : 
                    passwordStrength.score >= 3 ? 'text-blue-600' :
                    passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {errors.password && touched.password && (
              <p id="password-error" className="text-sm text-red-500" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`pl-10 pr-20 transition-colors ${
                  errors.confirmPassword && touched.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : !errors.confirmPassword && touched.confirmPassword && formData.confirmPassword
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
                placeholder="Confirm your password"
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                aria-invalid={!!errors.confirmPassword}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {getFieldIcon('confirmPassword')}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p id="confirm-password-error" className="text-sm text-red-500" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Button variant="link" asChild>
              <a href="/login">Entrar</a>
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationPage; 