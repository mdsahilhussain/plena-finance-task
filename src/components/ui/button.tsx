interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  children: string;
  onClick?: () => void;
}
const Button = ({ type = 'submit', onClick, children, ...rest }: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;
