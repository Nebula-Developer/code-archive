import { aggregate, readItems } from "@directus/sdk";
import directus from "../../lib/directus";
import { Page } from "../../lib/pages";
import PageCard from "../components/PageCard";
import HomeSearch from "../components/HomeSearch";
import Link from "next/link";
import SearchPanel from "./SearchPanel";

export const dynamic = "force-dynamic";

export default Page(async ({ searchParams }) => {
  var filterAnd: object[] = [];
  var filterOr: object[] = [];

  let tags: string[] = [];
  let category: number | undefined = undefined;

  if (searchParams.tags) {
    tags = searchParams.tags.split(",");

    for (var i in tags) {
      var tag = tags[i];
      filterAnd.push({ tags: { _contains: tag } });
    }
  }

  if (searchParams.category) {
    try {
      category = parseInt(searchParams.category);
      filterAnd.push({ category: { _eq: category } });
    } catch {
      category = undefined;
    }
  }

  let pages: any[] = [];
  let pageCount: number | any = 1;
  let curPage = 1;
  const resultsPerPage = 3;

  if (searchParams.page) {
    try {
      curPage = parseInt(searchParams.page);
      curPage = Math.max(curPage, 1);
    } catch {
      curPage = 1;
    }
  }

  let query: any = {
    filter: {
        _and: filterAnd,
        _or: filterOr
    },
    sort: [ "-date_created" ],
  };
  if (searchParams.q) query.search = searchParams.q;

  let categories: any[];

  try {
    categories = await directus.request(
      readItems("categories", {
        fields: ["id", "name", "parent.name"],
      })
    );

    pageCount = Math.ceil(
      (
        (await directus.request(
          aggregate("pages", {
            aggregate: { count: "*" },
            query: query,
          })
        )) as any
      )[0].count / resultsPerPage
    );

    pages = await directus.request(
      readItems("pages", {
        ...query,
        fields: ["title", "hero", "category.name", "category.id", "id", "tags"],
        limit: resultsPerPage,
        page: curPage,
      })
    );
  } catch (e) {
    return (
      <div className="flex flex-col py-20 space-y-5 items-center min-h-full justify-center">
        <div className="test-xl">
          Sorry, an error occured while searching pages:
        </div>

        <div className="text-sm">{JSON.stringify(e)}</div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-5 py-20">
        <SearchPanel
          categories={categories}
          category={category}
          tags={tags}
          q={query.search}
        />
        <h2 className="text-2xl md:text-3xl  mb-6">Search Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.reverse().map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>

        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: pageCount }, (_, index) => (
            <Link
              key={index + 1}
              href={{
                pathname: "/search",
                query: { ...searchParams, page: index + 1 },
              }}
              passHref
              className={`px-4 py-2 border ${
                curPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
});
