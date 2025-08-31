import { memo, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  onClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({ type = 'submit', onClick, children, ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      {...rest}
      className={cn(
        'px-4 py-2 bg-(--btn-bg) text-(--btn-text) rounded hover:bg-(--btn-bg-hover) transition flex items-center',
        children
      )}
    >
      {children}
    </button>
  );
};

const ButtonMemo = memo(Button);
export default ButtonMemo;
