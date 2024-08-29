import Link from "next/link";
import { Page } from "../../../lib/pages";
import Image from "next/image";
import PageContent from "../../components/PageContent";
import React from "react";
import { notFound } from "next/navigation";
import { randomIntFromInt } from "../../components/PageCard";
import directus, { API_URL } from "../../../lib/directus";
import { readItem, readFile, readFiles } from "@directus/sdk";

export const dynamic = 'force-dynamic';

export default Page(async ({ params }) => {
  let page: any;
  let files: any[] = [];
  try {
    page = await directus.request(
      readItem("pages", params.id, {
        fields: [
          "title",
          "category.name",
          "category.id",
          "content",
          "hero",
          "date_created",
          "media.directus_files_id",
          "tags",
          "id"
        ],
      })
    );

    for (var i in page.media) {
      var file = await directus.request(
        readFile(page.media[i].directus_files_id, {
          fields: ["title", "id", "type", "filename_download"],
        })
      );
      files.push(file);
    }
  } catch (e) {
    console.log(e);
    return notFound();
  }

  var hero = "/images/Estuary" + randomIntFromInt(page.id, 1, 6) + ".jpg";
  if (page.hero) {
    hero = directus.url + "assets/" + page.hero;
  }

  return (
    <main className="bg-gray-100">
      <div className="w-full p-20 min-h-72 md:min-h-96 border-b-2 border-gray-200 relative">
        <Image
          src={hero}
          layout="fill"
          objectFit="cover"
          alt="Home background"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />

        <div className="absolute bottom-0 left-0 m-8 w-[calc(100%-4rem)]">
          <div className="flex justify-between w-full items-end">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl md:text-4xl  text-white">
                {page.title}
              </h1>

              <div className="flex gap-1 mt-2 flex-wrap">
                {page.tags &&
                  page.tags.map((tag) => (
                    <a
                      href={"/search?tags=" + tag}
                      className="hover:bg-sky-500 bg-sky-600 cursor-pointer px-2 p-1 rounded-lg text-xs text-white"
                      key={tag}
                    >
                      {tag}
                    </a>
                  ))}
              </div>
            </div>

            <div className="flex flex-col items-end text-end sm:text-sm text-xs">
              <p className=" text-white">
                Uploaded {new Date(page.date_created).toLocaleDateString()}
              </p>
              <Link
                href={"/search?category=" + page.category.id}
                className="flex space-x-2 items-center text-lg text-gray-300 hover:text-cyan-500 no-underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                </svg>

                <span>{page.category.name}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-12">
        <div className="p-5 bg-white rounded-xl shadow-xl">
          <PageContent content={page.content ?? ""} />
        </div>

        <div className="mt-12">
          <div className="text-2xl">Assets</div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {files.map((file) => (
              <a
                key={file.id}
                className="bg-gray-200 hover:bg-gray-100 text-center flex justify-center items-center flex-col p-5 shadow-sm hover:shadow-xl transition-all duration-100 ease-out border border-gray-200 rounded-xl hover:scale-105"
                href={API_URL + "assets/" + file.id}
                target="_blank"
              >
                <div className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    {(file.type.startsWith("image") && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    )) || (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    )}
                  </svg>

                  <p className="text-ellipsis truncate max-w-40 hover:whitespace-normal">{file.title}</p>
                </div>
                <span className="text-gray-500 text-sm text-ellipsis truncate max-w-60 hover:whitespace-normal">
                  ({file.filename_download})
                </span>
                {file.type.startsWith("image") && (
                  <Image
                    alt={file.title}
                    src={directus.url + "assets/" + file.id}
                    width={200}
                    height={200}
                    className="w-24 h-12 sm:h-20 sm:w-28 object-cover mt-3 rounded-lg"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
});
