/**
 * Skeleton loading placeholder component.
 * Usage: <Skeleton className="h-4 w-32" /> or <Skeleton variant="card" />
 */
const Skeleton = ({ className = '', variant }) => {
  if (variant === 'card') {
    return (
      <div className="card p-6 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <tr>
        {Array.from({ length: 6 }).map((_, i) => (
          <td key={i} className="px-4 py-4">
            <Skeleton className="h-4 w-full" />
          </td>
        ))}
      </tr>
    );
  }

  return <div className={`skeleton ${className}`} />;
};

export const SkeletonCard = () => (
  <div className="card p-6 animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
    <Skeleton className="h-8 w-36" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const SkeletonTableRows = ({ rows = 5, cols = 6 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="px-6 py-4">
            <Skeleton className={`h-4 ${j === 0 ? 'w-40' : 'w-24'}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default Skeleton;
