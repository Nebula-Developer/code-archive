import Link from "next/link";
import { Page } from "../lib/types";
import Image from "next/image";

export function randomIntFromInt(input: number, min: number, max: number) {
  // not random, just amplified
  return (input % (max - min)) + min;
}

export default function PageCard({ page }: { page: Page }) {
  var hero = "/images/Estuary" + randomIntFromInt(page.id, 1, 6) + ".jpg";
  if (page.attributes?.hero?.data?.attributes) {
    hero = "http://localhost:1337" + page.attributes.hero?.data.attributes.url;
  }

  return (
    <div className="bg-white shadow-xl rounded-lg hover:scale-105 transition-transform duration-200 border border-gray-200 overflow-hidden pb-5">
      <Link
        href={`/page/${page.attributes.slug ?? page.id ?? "404"}`}
        className="w-full flex flex-col"
      >
        <Image
          src={hero}
          // src="/images/HomeBG.jpg"
          className="w-full h-32 object-cover rounded-lg"
          alt={page.attributes.title}
          width="1080"
          height="720"
        />
        <h1 className="text-2xl  px-5 mt-5">{page.attributes.title}</h1>
      </Link>
      {page.attributes.category && page.attributes.category.data && (
        <Link
          href={"/search?category=" + page.attributes.category.data.id}
          className="p-5 text-sm  text-gray-400 hover:underline"
        >
          {page.attributes.category.data.attributes.name}
        </Link>
      )}
    </div>
  );
}
