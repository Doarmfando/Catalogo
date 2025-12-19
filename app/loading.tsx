import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f6f3f2]">
      {/* Navbar Skeleton */}
      <div className="sticky top-0 z-20 backdrop-blur-[16px] bg-[#FFFFFF] border-b border-[rgba(0,44,95,0.16)]">
        <div className="container-custom">
          <div className="flex items-center justify-between py-3">
            <Skeleton className="h-11 w-32" />
            <div className="hidden lg:flex gap-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="container-custom py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </div>

      {/* Brands Section Skeleton */}
      <div className="container-custom py-16">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>

      {/* Contact Section Skeleton */}
      <div className="container-custom py-16">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  );
}
