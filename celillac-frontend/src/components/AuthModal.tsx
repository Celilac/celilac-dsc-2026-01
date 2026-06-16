import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../services/auth.service';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string, message: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type Mode = 'login' | 'register' | 'recover';

function translateSingleErrorMessage(msg: string): string {
  const lowerMsg = msg.toLowerCase();
  
  if (
    lowerMsg.includes('email already exists') ||
    lowerMsg.includes('e-mail informado já está em uso') ||
    lowerMsg.includes('already in use')
  ) {
    return 'Este e-mail já está cadastrado no sistema.';
  }
  
  if (
    lowerMsg.includes('invalid credentials') || 
    lowerMsg.includes('credenciais inválidas') ||
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('não autorizado')
  ) {
    return 'E-mail ou senha incorretos.';
  }

  if (lowerMsg.includes('password must be longer than or equal to 6 characters')) {
    return 'A senha deve conter pelo menos 6 caracteres.';
  }
  if (lowerMsg.includes('password must be longer than or equal to 8 characters')) {
    return 'A senha deve conter pelo menos 8 caracteres.';
  }
  if (lowerMsg.includes('password should not be empty')) {
    return 'A senha não pode estar vazia.';
  }
  if (lowerMsg.includes('password must be a string')) {
    return 'A senha deve ser um texto válido.';
  }

  if (lowerMsg.includes('email must be an email')) {
    return 'O formato do e-mail é inválido. Por favor, insira um e-mail válido.';
  }
  if (lowerMsg.includes('email should not be empty')) {
    return 'O e-mail é obrigatório.';
  }
  if (lowerMsg.includes('email must be a string')) {
    return 'O e-mail deve ser um texto válido.';
  }

  if (lowerMsg.includes('name should not be empty') || lowerMsg.includes('name não pode estar vazio')) {
    return 'O nome completo é obrigatório.';
  }
  if (lowerMsg.includes('name must be a string')) {
    return 'O nome deve ser um texto válido.';
  }

  if (lowerMsg.includes('role must be one of the following values')) {
    return 'Perfil de usuário inválido.';
  }

  return msg;
}

function translateBackendError(message: string): string {
  if (!message) return 'Ocorreu um erro inesperado.';
  
  if (message.includes(',')) {
    const parts = message.split(',').map(part => part.trim());
    const translatedParts = parts.map(part => translateSingleErrorMessage(part));
    const uniqueParts = Array.from(new Set(translatedParts));
    return uniqueParts.join(' ');
  }
  
  return translateSingleErrorMessage(message);
}

export function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (mode === 'login') {
      if (!password) {
        newErrors.password = 'Senha é obrigatória';
      }
    }

    if (mode === 'register') {
      if (!name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (!password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        newErrors.password = 'A senha não atende a todos os critérios de senha forte';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'login') {
        const response = await authService.login({ email, password });
        onAuthSuccess(response.user, response.accessToken, `Bem-vindo(a) de volta, ${response.user.name || response.user.email}!`);
        resetForm();
        onClose();
      } else if (mode === 'register') {
        // Create user
        await authService.register({ name, email, password });
        
        // Auto-login after registration
        const loginResponse = await authService.login({ email, password });
        onAuthSuccess(
          loginResponse.user,
          loginResponse.accessToken,
          'Cadastro realizado com sucesso! Você foi autenticado automaticamente.'
        );
        resetForm();
        onClose();
      } else if (mode === 'recover') {
        const response = await authService.recoverPassword(email);
        showToast(response.message, 'success');
        setMode('login');
        setPassword('');
      }
    } catch (err: unknown) {
      console.error(err);
      const rawErrorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao processar a requisição.';
      const errorMessage = translateBackendError(rawErrorMessage);
      showToast(errorMessage, 'error');
      setErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setName('');
    setErrors({});
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) {
      setErrors((prev) => ({ ...prev, email: 'E-mail é obrigatório' }));
    } else if (!emailRegex.test(val)) {
      setErrors((prev) => ({ ...prev, email: 'E-mail inválido' }));
    } else {
      setErrors((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSwitchMode = (newMode: Mode) => {
    setMode(newMode);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={!isLoading ? onClose : undefined}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl animate-fade-in-scale md:p-10">
        
        {/* Glow behind modal */}
        <div className="absolute -top-20 -left-20 -z-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 -z-10 h-40 w-40 rounded-full bg-indigo-650/20 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-6 right-6 text-slate-400 hover:text-white hover:bg-slate-800/50 p-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Fechar modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 font-bold text-white shadow-lg shadow-purple-500/20 text-lg mb-3">
            C
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {mode === 'login' && 'Entrar na sua Conta'}
            {mode === 'register' && 'Criar Nova Conta'}
            {mode === 'recover' && 'Recuperar Senha'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            {mode === 'login' && 'Insira seus dados para continuar'}
            {mode === 'register' && 'Preencha os dados abaixo para se cadastrar'}
            {mode === 'recover' && 'Insira seu e-mail para receber as instruções'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Register Mode Only) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Nome Completo</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Seu nome"
                  className={`w-full px-4 py-3 bg-slate-950/65 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all ${
                    errors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-purple-500/60'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-450">{errors.name}</p>}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Endereço de E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={isLoading}
              placeholder="seuemail@exemplo.com"
              className={`w-full px-4 py-3 bg-slate-950/65 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all ${
                errors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-purple-500/60'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-450">{errors.email}</p>}
          </div>

          {/* Password Field (Login & Register Mode Only) */}
          {mode !== 'recover' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Senha</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('recover')}
                    disabled={isLoading}
                    className="text-[11px] font-medium text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full pl-4 pr-10 py-3 bg-slate-950/65 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all ${
                    errors.password ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-purple-500/60'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-450">{errors.password}</p>}

              {/* Password Strength Checklist */}
              {mode === 'register' && (
                <div className="mt-2 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 space-y-1.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">A senha deve conter:</p>
                  <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300 ${hasMinLength ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className={hasMinLength ? 'text-emerald-400 transition-colors' : 'text-slate-400'}>Mínimo de 8 caracteres</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300 ${hasUppercase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className={hasUppercase ? 'text-emerald-400 transition-colors' : 'text-slate-400'}>Uma letra maiúscula (A-Z)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300 ${hasLowercase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className={hasLowercase ? 'text-emerald-400 transition-colors' : 'text-slate-400'}>Uma letra minúscula (a-z)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300 ${hasNumber ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className={hasNumber ? 'text-emerald-400 transition-colors' : 'text-slate-400'}>Um número (0-9)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300 ${hasSpecialChar ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className={hasSpecialChar ? 'text-emerald-400 transition-colors' : 'text-slate-400'}>Um caractere especial (ex: @, #, $, %)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Confirm Password Field (Register Mode Only) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Confirmar Senha</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full pl-4 pr-10 py-3 bg-slate-950/65 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all ${
                    errors.confirmPassword ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-purple-500/60'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-250 cursor-pointer"
                  aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-450">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Form-level Error Message */}
          {errors.form && (
            <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-xl">
              <p className="text-xs text-rose-400 font-medium text-center">{errors.form}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-purple-650 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processando...
              </>
            ) : (
              <>
                {mode === 'login' && 'Entrar'}
                {mode === 'register' && 'Cadastrar'}
                {mode === 'recover' && 'Enviar E-mail de Recuperação'}
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400">
          {mode === 'login' && (
            <p>
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                disabled={isLoading}
                className="font-semibold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
              >
                Cadastre-se
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p>
              Já possui uma conta?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                disabled={isLoading}
                className="font-semibold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
              >
                Faça login
              </button>
            </p>
          )}

          {mode === 'recover' && (
            <p>
              Lembrou sua senha?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                disabled={isLoading}
                className="font-semibold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
              >
                Voltar para Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
