import Link from "next/link";
import { Page } from "../../../lib/pages";
import Image from "next/image";
import PageContent from "../../components/PageContent";
import React from "react";
import { notFound } from "next/navigation";
import { randomIntFromInt } from "../../components/PageCard";
import directus, { API_URL } from "../../../lib/directus";
import { readItem, readFile, readFiles } from "@directus/sdk";

export default Page(async ({ params }) => {
  let page: any;
  let files: any[] = [];
  try {
      page = await directus.request(readItem('pages', params.id, {
          fields: ['title', 'category.name', 'category.id', 'content', 'hero', 'date_created', 'media.directus_files_id']
      }));
      
      for (var i in page.media) {
          var file = await directus.request(readFile(page.media[i].directus_files_id, {
            fields: ['title', 'id', 'type']
          }));
          files.push(file);
      }
  } catch (e) {
    console.log(e)
      return notFound();
  }

  var hero = "/images/Estuary" + randomIntFromInt(page.id, 1, 6) + ".jpg";
  if (page.hero) {
    hero = directus.url + 'assets/' + page.hero;
  }

  return (
    <main>
      <div className="w-full p-20 min-h-72 md:min-h-96 border-b-2 border-gray-200 relative">
        <Image src={hero} layout="fill" objectFit="cover" alt="Home background" />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />
        
        <div className="absolute bottom-0 left-0 m-8 w-[calc(100%-4rem)]">
          <div className="flex justify-between w-full items-end">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl md:text-4xl  text-white">{page.title}</h1>
              <Link href={"/search?category=" + page.category.id} className="text-sm  text-white hover:underline">{page.category.name}</Link>
            </div>

            <div className="flex flex-col items-end text-end sm:text-sm text-xs">
              <p className=" text-white">Uploaded {new Date(page.date_created).toLocaleDateString()}</p>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-12">
        <PageContent content={page.content ?? ""} />

        <div className="mt-5">
          <div className="text-2xl">Assets</div>
          
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {files.map(file => (
              <a className="flex justify-center items-center flex-col p-5 shadow-xl border border-gray-200 rounded-xl hover:scale-105" href={API_URL + 'assets/' + file.id}>
                {file.title}
                {file.type.startsWith('image') && (
                  <Image alt={file.title} src={directus.url + 'assets/' + file.id} width={112} height={112} className="w-24 h-12 sm:h-20 sm:w-28 object-cover mt-3" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
});