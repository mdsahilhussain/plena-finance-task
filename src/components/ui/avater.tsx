import { cn } from '../../lib/utils';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number; // default 40px
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 40, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full object-cover block', `w-[${size}px] h-[${size}px]`, className)}
      loading="lazy"
      decoding="async"
    />
  );
};

export default Avatar;
