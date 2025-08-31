interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  children: string;
}
const Button = ({ type = 'submit', children, ...rest }: ButtonProps) => {
  return (
    <button type={type} {...rest}>
      {children}
    </button>
  );
};

export default Button;
