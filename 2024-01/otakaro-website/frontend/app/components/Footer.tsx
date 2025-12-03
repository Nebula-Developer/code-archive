import Link from "next/link";


export default function Footer() {
  return (
    <div className="flex justify-center items-center flex-shrink-0 h-52 shadow-xl z-[9999] border-t border-gray-200 bg-white">
      <div className="flex justify-between m-12 container h-full">
        <div className="flex flex-col justify-center gap-2">
          <Link href="/" className="hover:underline">
            <h1 className="text-2xl ">Ōtākaro Ako</h1>
          </Link>

          <Link href="https://github.com/nebula-developer" className="hover:underline">
            <p className="text-xs ">Nico Cook / NebulaDev &copy; 2024</p>
          </Link>
        </div>

        <div className="flex flex-col items-end justify-center">
          <h1 className="text-xl mb-2 ">Links</h1>
          <Link href="/about" className="text-sm  hover:underline">About</Link>
          <Link href="/contact" className="text-sm  hover:underline">Contact</Link>
          <Link href="/search" className="text-sm  hover:underline">Search</Link>
        </div>
      </div>
    </div>
  );
}