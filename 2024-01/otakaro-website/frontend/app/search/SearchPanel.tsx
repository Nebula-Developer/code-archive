"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SearchPanel({
  category,
  categories,
  tags,
  q,
}: {
  category: number | undefined;
  categories: { id: number; name: string }[];
  tags: string[];
  q: string | undefined;
}) {
  let catCopy = category;
  let [categorySel, setCategorySelX] = useState<number | undefined>(category);
  const setCategorySel = (x) => {
    setCategorySelX(x);
    catCopy = x;
  };

  let tagsCopy = tags;
  let [tagsSel, setTagsSelX] = useState<string[]>(tags);
  const setTagsSel = (x) => {
    setTagsSelX(x);
    tagsCopy = x;
  };

  let [query, setQuery] = useState<string | undefined>(q);

  useEffect(() => {
    setCategorySel(catCopy);
    setTagsSel(tagsCopy);
  }, [catCopy, tagsCopy]);

  return (
    <div className="w-full bg-gray-100 rounded-xl shadow-xl p-5 mb-10">
      <div className="flex flex-wrap gap-5 items-start">
        <div className="flex flex-col space-y-3">
          <div className="text-sm">Category</div>

          <select
            value={categorySel}
            onChange={(v) => setCategorySel(parseInt(v.target.value))}
            className="h-11 px-3 py-2 outline outline-2 outline-gray-300 focus:outline-sky-500 shadow-lg rounded-lg bg-gray-100"
          >
            <option value={undefined}>All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="text-sm">Tags (enter to create)</div>

          <input
            className="h-11 px-3 py-2 outline outline-2 outline-gray-300 focus:outline-sky-500 shadow-lg rounded-lg bg-gray-100"
            type="text"
            onKeyDown={(e: any) => {
              if (
                (e.key == "Enter" || e.key == ",") &&
                e.target.value.trim().length > 0
              ) {
                setTagsSel([...tagsSel, e.target.value.trim()]);
                e.target.value = "";
                e.preventDefault();
              }
            }}
          />

          {tagsSel.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tagsSel.map((t, i) => (
                <div
                  onClick={(e) => setTagsSel(tagsSel.filter((x) => t != x))}
                  className="px-2 py-1 text-sm bg-sky-500 hover:bg-red-400 cursor-pointer text-white rounded-lg"
                  key={i}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col space-y-3">
          <div className="text-sm">Search</div>

          <input
            className="h-11 px-3 py-2 outline outline-2 outline-gray-300 focus:outline-sky-500 shadow-lg rounded-lg bg-gray-100"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-3">
          <div className="text-sm">Search</div>
          <Link
            href={{
              pathname: "/search",
              query: {
                q: query,
                tags: tagsSel.join(","),
                category: categorySel,
              },
            }}
            className="h-11 flex items-center justify-center p-5 bg-gray-200 hover:bg-gray-500 hover:text-white transition-colors duration-75 rounded-xl shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
