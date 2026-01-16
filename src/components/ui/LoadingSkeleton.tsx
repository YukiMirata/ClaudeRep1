import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'button';
}

const LoadingSkeleton = ({ className = '', variant = 'text' }: LoadingSkeletonProps) => {
  const baseClasses = 'bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg animate-shimmer';

  const variants = {
    text: 'h-4 w-full',
    card: 'h-48 w-full',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-10 w-32',
  };

  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" className="w-3/4" />
          <LoadingSkeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
      <LoadingSkeleton variant="text" className="w-2/3 h-3" />
      <div className="flex gap-2 mt-3">
        <LoadingSkeleton variant="button" className="h-6 w-16" />
        <LoadingSkeleton variant="button" className="h-6 w-16" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
