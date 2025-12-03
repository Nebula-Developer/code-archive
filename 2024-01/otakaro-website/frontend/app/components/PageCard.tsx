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
    hero = directus.url + "assets/" + page.hero;
  }

  return (
    <div className="bg-white shadow-xl rounded-lg hover:scale-105 transition-transform duration-200 border border-gray-200 overflow-hidden pb-5">
      <Link href={`/page/${page.id ?? "404"}`} className="w-full flex flex-col">
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
          className="p-5 text-sm  text-gray-400 underline hover:no-underline hover:text-gray-500"
        >
          {page.category.name}
        </Link>
      )}

      <div className="flex gap-2 flex-wrap mx-5 mt-2">
        {page.tags && page.tags.map((tag) => <a href={"/search?tags=" + tag} className="bg-sky-500 hover:bg-sky-700 cursor-pointer px-2 p-1 rounded-lg text-xs text-white" key={tag}>{tag}</a>)}
      </div>
    </div>
  );
}   
