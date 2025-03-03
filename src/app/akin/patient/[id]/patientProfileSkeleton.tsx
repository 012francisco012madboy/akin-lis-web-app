import { Skeleton } from "@/components/ui/skeleton"


export const PatientByIdProfileSkeleton = () => {
  return (
    <div className="w-full h-full flex justify-between gap-5 pr-2">
      <Skeleton className="w-full h-full bg-gray-500/20 mb-10" />
      <div className=" w-[300px] space-y-10 ">
        <Skeleton className="w-[300px] h-[250px] bg-gray-500/20" />
        <Skeleton className="w-[300px] h-[250px] bg-gray-500/20" />
      </div>
    </div>
  )
}