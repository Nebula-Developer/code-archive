import Link from "next/link";
import Image from "next/image";
import directus from "../../lib/directus";

export function randomIntFromInt(input: number, min: number, max: number) {
  // not random, just amplified
  return (input % (max - min)) + min;
}

export default function PageCard({ page }: { page: any }) {
  var hero = "/images/Estuary" + randomIntFromInt(page.id, 1, 6) + ".jpg";
  if (page.hero) {
    hero = directus.url + 'assets/' + page.hero;
  }

  return (
    <div className="bg-white shadow-xl rounded-lg hover:scale-105 transition-transform duration-200 border border-gray-200 overflow-hidden pb-5">
      <Link
        href={`/page/${page.id ?? "404"}`}
        className="w-full flex flex-col"
      >
        <Image
          src={hero}
          // src="/images/HomeBG.jpg"
          className="w-full h-32 object-cover rounded-lg"
          alt={page.title}
          width="1080"
          height="720"
        />
        <h1 className="text-2xl  px-5 mt-5">{page.title}</h1>
      </Link>
      {page.category && (
        <Link
          href={"/search?category=" + page.category.id}
          className="p-5 text-sm  text-gray-400 hover:underline"
        >
          {page.category.name}
        </Link>
      )}
    </div>
  );
}
