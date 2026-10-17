import { cn } from '../utils/helpers';

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
        hover &&
          'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      {...props}
      className={cn('mb-4 flex items-start justify-between', className)}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      {...props}
      className={cn(
        'text-base font-semibold text-gray-900 dark:text-gray-100',
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      {...props}
      className={cn('mt-1 text-sm text-gray-500 dark:text-gray-400', className)}
    >
      {children}
    </p>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        'mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800',
        className
      )}
    >
      {children}
    </div>
  );
}
