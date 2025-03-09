'use client';
import { CSSProperties, FC, memo } from 'react';
import styles from './Button.module.scss';
import { useRouter } from '@/i18n/routing';

interface Props {
  text: string;
  style?: CSSProperties;
  colored?: boolean;
  submit?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  formPage?: 'main' | 'event';
  ariaLabel?: string;
}

const Button: FC<Props> = memo(({
  text,
  style,
  colored,
  submit,
  disabled = false,
  onClick,
  formPage,
  ariaLabel,
}) => {
  const router = useRouter();

  const openForm = (page: 'event' | 'main') => {
    if (page === 'event') router.push(`/event/form`);
    if (page === 'main') router.push(`/form`);
  };

  const handleClick = () => {
    if (disabled) return;
    
    if (formPage) {
      openForm(formPage);
    } else if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleClick();
    }
  };

  // Determine CSS classes based on props
  const buttonClass = colored ? styles.buttonColored : styles.button;
  const disabledClass = disabled ? styles.disabled : '';
  const combinedClassName = `${buttonClass} ${disabledClass}`.trim();

  return (
    <button
      type={submit ? 'submit' : 'button'}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel || text}
      aria-disabled={disabled}
      className={combinedClassName}
    >
      {text}
    </button>
  );
});

// Add display name for better debugging
Button.displayName = 'Button';

export default Button;
