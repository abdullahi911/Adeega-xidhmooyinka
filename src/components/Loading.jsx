import { cn } from '../utils/helpers';

export function Spinner({ size = 'md', className }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-violet-600 border-t-transparent',
        sizes[size],
        className
      )}
    />
  );
}

export default function Loading({ message = 'Loading…', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm dark:bg-gray-950/80">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Spinner size="md" />
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}
