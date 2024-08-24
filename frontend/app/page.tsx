import directus from "../lib/directus";
import React from "react";
import { readItem, readItems } from "@directus/sdk";

export default async function Page({ searchParams }) {
  var page = await directus.request(
    readItem("page", 5, {
      fields: ["*", "category.*"],
    })
  );

  var category = await directus.request(
    readItems("category", {
      filter: {
        name: searchParams.category,
      },
    })
  );

  return (
    <div>
      <div>
        {page.title} - {page.category.name}
      </div>

      <div dangerouslySetInnerHTML={{ __html: page.content }}></div>

      <div>{JSON.stringify(category)}</div>
    </div>
  );
}
