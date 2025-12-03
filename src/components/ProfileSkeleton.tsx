"use client";

export default function ProfileSkeleton() {
  return (
    <section className="animate-pulse">
      <div className="p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md mb-10">
        <div className="w-52 h-52 rounded-full bg-[#2A2A2A] mb-7 mx-auto md:mx-0"></div>

        <div className="grid grid-cols-2 gap-10 mt-10">
          <div className="space-y-5">
            <div className="h-4 w-40 bg-[#2A2A2A] rounded"></div>
            <div className="h-6 w-56 bg-[#2A2A2A] rounded"></div>
          </div>

          <div className="space-y-5">
            <div className="h-4 w-40 bg-[#2A2A2A] rounded"></div>
            <div className="h-6 w-52 bg-[#2A2A2A] rounded"></div>
          </div>
        </div>

        <div className="h-10 w-48 mt-10 bg-[#2A2A2A] rounded"></div>
      </div>

      <div className="flex gap-10 flex-col md:flex-row">
        <div className="p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md w-full space-y-5">
          <div className="h-6 w-40 bg-[#2A2A2A] rounded mb-5"></div>
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-[#2A2A2A] rounded-lg"></div>
          ))}
        </div>

        <div className="p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md w-full space-y-5">
          <div className="h-6 w-48 bg-[#2A2A2A] rounded mb-5"></div>
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-[#2A2A2A] rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  );
}
