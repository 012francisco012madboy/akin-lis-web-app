import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const PatientByIdProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header Skeleton */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Filters Skeleton */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Results Skeleton */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="border-l-4 border-l-gray-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-12 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-12 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};