import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ticket';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
  target?: string;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  href,
  className = '',
  type = 'button',
  target,
}: ButtonProps) {
  const baseClasses =
    'font-bebas text-lg tracking-[0.12em] uppercase inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98]';

  const variantClasses = {
    primary:
      'bg-magenta-burst text-pure-white px-10 py-4 border-none hover:bg-[#FF1A6B] hover:shadow-glow-magenta hover:scale-[1.02]',
    outline:
      'bg-transparent text-pure-white px-10 py-4 border border-white/30 hover:border-magenta-burst hover:text-magenta-burst hover:shadow-neon',
    ticket:
      'bg-magenta-burst text-pure-white px-6 py-2.5 border-none text-base tracking-[0.1em] animate-[ticket-pulse_2s_ease-in-out_infinite] hover:bg-[#FF1A6B]',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
