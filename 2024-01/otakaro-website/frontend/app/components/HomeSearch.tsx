"use client";

import { useState } from "react";

export default function HomeSearch() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex gap-2 flex-wrap">
      <input
        type="text"
        className="w-80 min-w-52 p-2 border-2 border-gray-200 rounded-md text-sm outline-none focus:border-blue-400"
        placeholder="Search for resources..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                window.location.href = `/search?q=${search}`;
            }
        }}
      />
      <a className="no-underline flex items-center justify-center p-2 bg-blue-400 hover:bg-blue-500 text-white text-sm rounded-md cursor-pointer" href={`/search?q=${search}`}>
        Search
      </a>
    </div>
  );
}
