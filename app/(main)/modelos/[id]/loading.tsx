import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ModelDetailLoading() {
  return (
    <>
      {/* HERO SKELETON */}
      <section className="relative overflow-hidden bg-[#0b1d35] text-white">
        {/* fondos */}
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top,rgba(9,87,165,0.55),transparent_58%)]" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.14),transparent_52%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:56px_56px]" />

        <div className="container-custom relative pt-12 lg:pt-24 pb-28 lg:pb-36">
          <div className="h-6 lg:h-8" aria-hidden="true" />

          {/* Top bar skeleton */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Skeleton className="h-9 w-40 rounded-full bg-white/10" />
            <div className="hidden md:flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
              <Skeleton className="h-6 w-32 rounded-full bg-white/10" />
            </div>
          </div>

          {/* Contenido */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-start">
            {/* LEFT */}
            <div className="lg:pr-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-7 w-32 rounded-full bg-white/10" />
                <Skeleton className="h-7 w-28 rounded-full bg-white/10" />
                <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
              </div>

              {/* Title */}
              <Skeleton className="h-12 lg:h-16 w-3/4 mt-5 bg-white/10" />

              {/* Price box */}
              <div className="mt-7">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                  <div>
                    <Skeleton className="h-4 w-24 bg-white/10" />
                    <Skeleton className="h-10 w-40 mt-1 bg-white/10" />
                    <Skeleton className="h-5 w-32 mt-1 bg-white/10" />
                  </div>
                </div>

                {/* Features grid */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Skeleton className="h-12 rounded-xl bg-white/5 border border-white/10" />
                  <Skeleton className="h-12 rounded-xl bg-white/5 border border-white/10" />
                  <Skeleton className="h-12 rounded-xl bg-white/5 border border-white/10" />
                </div>
              </div>
            </div>

            {/* RIGHT (IMAGE) */}
            <div className="relative z-10">
              <Skeleton className="aspect-video w-full bg-white/10" />
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg
            className="block w-full h-[84px] lg:h-[120px]"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              fill="#f6f3f2"
              d="M0,70 C240,120 480,128 720,98 C960,68 1200,16 1440,36 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </section>

      <div className="h-10 lg:h-14 bg-[#f6f3f2]" aria-hidden="true" />

      {/* VERSIONES SKELETON */}
      <section className="container-custom pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="mt-8 space-y-6">
          {/* Versiones cards skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-[1.3rem]" />
            ))}
          </div>
        </div>

        {/* CTA FINAL SKELETON */}
        <div className="mt-12 rounded-[1.3rem] bg-white border border-[rgba(0,44,95,0.14)] p-6 lg:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex-1">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-full max-w-96 mt-2" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
