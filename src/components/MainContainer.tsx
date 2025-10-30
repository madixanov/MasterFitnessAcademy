import React from "react"

export default function MainContainer({ children }: {children: React.ReactNode}) {
  return (
    <div className="relative w-full px-4 my-0 mx-auto lg:w-[960px] xl:w-[1140px] 2xl:w-[1350px]">
      {children}
    </div>
  )
}