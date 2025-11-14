import Link from "next/link"

export default function AuthHeader() {
  return (
    <Link href="/">
      <header className="w-full flex flex-col justify-center items-center p-6">
        <h1 className="text-3xl text-[#FF7A00]">Master Fitness Academy</h1>
        <p className="text-[#999]">РАЗВИВАЙ ТЕЛО. ПРОКАЧИВАЙ ХАРАКТЕР.</p>
      </header>
    </Link>
  )
}