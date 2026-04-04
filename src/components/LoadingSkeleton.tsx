import { motion } from "framer-motion";

const LoadingSkeleton = ({ message = "Generating your validation report..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center px-6">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl space-y-6"
    >
      <div className="text-center mb-10">
        <div className="skeleton-shimmer h-8 w-64 rounded-lg mx-auto mb-3" />
        <div className="skeleton-shimmer h-4 w-48 rounded mx-auto" />
      </div>

      {/* Score skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:row-span-2 glass rounded-2xl p-8 flex items-center justify-center">
          <div className="skeleton-shimmer w-32 h-32 rounded-full" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-5 space-y-3">
            <div className="skeleton-shimmer h-4 w-24 rounded" />
            <div className="skeleton-shimmer h-8 w-16 rounded" />
            <div className="skeleton-shimmer h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Section skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer w-9 h-9 rounded-lg" />
            <div className="skeleton-shimmer h-5 w-40 rounded" />
          </div>
          <div className="space-y-2">
            <div className="skeleton-shimmer h-3 w-full rounded" />
            <div className="skeleton-shimmer h-3 w-4/5 rounded" />
            <div className="skeleton-shimmer h-3 w-3/5 rounded" />
          </div>
        </div>
      ))}

      <p className="text-center text-sm text-muted-foreground animate-pulse">{message}</p>
    </motion.div>
  </div>
);

export default LoadingSkeleton;
