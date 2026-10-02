import React from 'react';

// Primary Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-[10px] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FF6A1A]/40';
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-mono',
    md: 'text-xs px-4 py-2.5 gap-2 font-mono',
    lg: 'text-sm px-6 py-3.5 gap-2.5 font-mono'
  };

  const variantStyles = {
    primary: 'bg-[#FF6A1A] hover:bg-[#FF8A3D] text-[#08090B] shadow-[0_0_20px_rgba(255,106,26,0.3)] hover:shadow-[0_0_28px_rgba(255,106,26,0.5)] border border-[#FF8A3D]/40 font-bold',
    secondary: 'bg-[#181B1F] hover:bg-[#22262C] text-[#F5F5F2] border border-[#292D32] hover:border-[#FF6A1A]/50 shadow-sm',
    outline: 'bg-transparent hover:bg-[#FF6A1A]/10 text-[#FF6A1A] border border-[#FF6A1A]/60 hover:border-[#FF6A1A]',
    ghost: 'bg-transparent hover:bg-[#181B1F] text-[#92979D] hover:text-[#F5F5F2]',
    danger: 'bg-[#FF5C5C]/15 hover:bg-[#FF5C5C]/25 text-[#FF5C5C] border border-[#FF5C5C]/40'
  };

  return (
    <button
      className={`${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};

// Technical Badge / Pill
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'sm',
  pulse = false
}) => {
  const styles = {
    orange: 'bg-[#FF6A1A]/15 text-[#FF8A3D] border-[#FF6A1A]/35',
    success: 'bg-[#45D483]/15 text-[#45D483] border-[#45D483]/35',
    warning: 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/35',
    danger: 'bg-[#FF5C5C]/15 text-[#FF5C5C] border-[#FF5C5C]/35',
    neutral: 'bg-[#181B1F] text-[#92979D] border-[#292D32]',
    info: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/35'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase rounded-md border ${styles[variant]} ${sizes[size]}`}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};

// Panel Card
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  title?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  title,
  badge,
  action
}) => {
  return (
    <div
      className={`relative rounded-[12px] bg-[#111316] border border-[#292D32] transition-all duration-200 ${
        glow ? 'border-[#FF6A1A]/40 shadow-[0_0_24px_rgba(255,106,26,0.12)]' : 'hover:border-[#292D32]/90'
      } ${className}`}
    >
      {(title || badge || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E2227]">
          <div className="flex items-center gap-2.5">
            {title && (
              <h3 className="text-xs uppercase tracking-widest font-mono text-[#F5F5F2] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A]" />
                {title}
              </h3>
            )}
            {badge}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

// Progress Bar
export interface ProgressBarProps {
  value: number; // 0 - 100
  variant?: 'orange' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'orange',
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const colors = {
    orange: 'bg-[#FF6A1A] shadow-[0_0_8px_rgba(255,106,26,0.5)]',
    success: 'bg-[#45D483] shadow-[0_0_8px_rgba(69,212,131,0.5)]',
    warning: 'bg-[#FFB547] shadow-[0_0_8px_rgba(255,181,71,0.5)]',
    danger: 'bg-[#FF5C5C] shadow-[0_0_8px_rgba(255,92,92,0.5)]'
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-[#92979D]">RATIO</span>
          <span className="text-[#F5F5F2] font-bold">{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-[#181B1F] rounded-full overflow-hidden border border-[#292D32]/60 ${heights[size]}`}>
        <div
          className={`h-full transition-all duration-500 rounded-full ${colors[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

// Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-mono tracking-wider uppercase text-[#92979D] font-medium flex items-center justify-between">
          <span>{label}</span>
          {hint && <span className="text-[10px] text-[#92979D]/70 lowercase">{hint}</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-[#92979D] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-[#111316] text-[#F5F5F2] border ${
            error ? 'border-[#FF5C5C]' : 'border-[#292D32]'
          } rounded-[10px] px-3.5 py-2.5 text-sm placeholder-[#92979D]/40 focus:outline-none focus:border-[#FF6A1A] focus:ring-1 focus:ring-[#FF6A1A] transition-colors ${
            icon ? 'pl-9' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-[11px] text-[#FF5C5C] font-mono">{error}</span>}
    </div>
  );
};
