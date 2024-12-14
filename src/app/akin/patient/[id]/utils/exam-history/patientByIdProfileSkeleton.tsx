import { Skeleton } from "@/components/ui/skeleton"


export const PatientByIdProfileSkeleton = () => {
  return (
    <div className="w-full h-full space-y-5">
      <Skeleton className="w-full h-12 bg-gray-500/20" />
      <Skeleton className="w-full h-[500px] bg-gray-500/20" />
    </div>
  )
}