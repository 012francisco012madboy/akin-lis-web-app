import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700/70 to-transparent"
        style={{
          content: "''",
          position: "absolute",
          inset: "0",
          background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)",
          animation: "shimmer 1s infinite",
        }}
      ></div>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1s infinite;
        }
      `}</style>
    </div>
  )
}

export { Skeleton }
