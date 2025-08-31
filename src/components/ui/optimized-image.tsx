import { cn } from '../../lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  className?: string;
}

const OptimizedImage = ({ src, alt, width, height, priority, className }: OptimizedImageProps) => {
  return (
    <div
      className={`overflow-hidden ${width ? `w-[${width}px]` : 'w-auto'} ${
        height ? `h-[${height}px]` : 'h-auto'
      }`}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn('block object-cover', className)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
};
export default OptimizedImage;
