export default function MyCourseCardSkeleton() {
  return (
    <div
      className="mb-10 rounded-xl border border-[#834002]
      bg-gradient-to-b from-[#FF7A0033] to-[#FF7A000D]
      p-6 animate-pulse"
    >
      <article className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* Image */}
        <div className="w-full h-[200px] bg-[#2a2a2a] rounded-lg" />

        {/* Content */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 bg-[#333] rounded" />
              <div className="h-5 w-1/2 bg-[#333] rounded" />
              <div className="ml-auto h-6 w-20 bg-[#333] rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-2 mb-5">
              <div className="h-4 w-full bg-[#333] rounded" />
              <div className="h-4 w-5/6 bg-[#333] rounded" />
            </div>

            {/* Meta */}
            <div className="flex gap-6">
              <div className="h-4 w-28 bg-[#333] rounded" />
              <div className="h-4 w-28 bg-[#333] rounded" />
            </div>
          </div>

          {/* Button */}
          <div className="mt-5">
            <div className="h-9 w-44 bg-[#333] rounded-lg" />
          </div>
        </div>
      </article>
    </div>
  );
}
