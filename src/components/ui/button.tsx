import { memo, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  children,
  className,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      {...rest}
      className={cn(
        'px-4 py-2 rounded cursor-pointer transition flex items-center text-(--text-primary)',
        className
      )}
    >
      {children}
    </button>
  );
};

const ButtonMemo = memo(Button);
export default ButtonMemo;
