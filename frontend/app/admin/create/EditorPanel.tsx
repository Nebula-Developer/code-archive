"use client";
import { Editor } from "@tinymce/tinymce-react";
import { useCallback, useEffect, useRef, useState } from "react";
// import Section from "../lib/models/Section";
// import Page from "../lib/models/Page";
// import pageCSS from "../lib/pageCSS";
// import Category from "../lib/models/Category";
import Image from "next/image";
import TinyEditor from "./TinyEditor";
import { fetchAPI } from "@/app/lib/api";
import state from "@/app/lib/state";
import { User } from "@/app/lib/types";
import AdminInput from "@/app/components/AdminInput";
import { CategorySelect } from "./CategorySelect";

function mapTags(tags: string) {
  var tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
  tagArray = tagArray.map((tag) => tag.replace(/[^a-z0-9-_]/g, ""));

  return tagArray;
}

export function EditorPanel({
  user,
  categoryFetch,
}: {
  user: User;
  categoryFetch: any;
}) {
  var page = {
    name: "New Page",
    image: "",
    content: "",
  };

  const [heroImage, setHeroImage] = useState<File | null>(null);
  const heroImageRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>(page?.name ?? "");
  const [image, setImage] = useState<string>(page ? page.image ?? "" : "");
  const [slug, setSlug] = useState<string>("");

  const [tags, setTags] = useState<string[]>([]);

  const [imageError, setImageError] = useState<string | null>(null);
  const [preview, setPreview] = useState<boolean>(false);

  const [categories, setCategories] = useState(categoryFetch);
  const [selected, setSelected] = useState<number[]>([]);
  const [creating, setCreating] = useState<boolean>(false);

  const [content, setContent] = useState<string>("");

  const editorRef = useRef<any>(null);

  useEffect(() => {
    const editor = editorRef.current;
    console.log(editor)
  });

  return (
    <div className="flex flex-col pb-5 w-full h-fit bg-slate-200 items-center text-black min-h-screen">
      <div className="container flex flex-col space-y-5">
        <div className="flex justify-between py-12 px-5 w-full">
          <div className="flex items-center space-x-2">
            <div className="text-green-600 text-3xl">•</div>
            <div className="text-slate-700 text-2xl">
              {page ? page.name : "New Page"}
            </div>
          </div>

          <div className="flex space-x-1">
            <button
              className="bg-gradient-to-b from-blue-400 to-sky-600 px-5 py-2 text-white rounded-md border-[1px] border-sky-500"
              onClick={() => {
                fetchAPI("/api/pages", {
                  method: "POST",
                  body: {
                    data: {
                      title: name,
                      content: content,
                        hero: image || undefined,
                      slug: slug,
                      categories: selected[selected.length - 1],
                    },
                  },
                }).then((res) => {
                  location.href = "/page/" + res.data.attributes.slug;
                });
              }}
            >
              Save Page
            </button>
          </div>
        </div>

        <div className="flex w-full sm:flex-row flex-col space-x-0 sm:space-x-5">
          <div className="flex-[0.7] h-fit flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-5 text-lg bg-slate-50 border-b-2 border-slate-200 flex justify-between">
              <div>Main Content</div>

              <button
                className="bg-transparent text-sky-500 rounded-md"
                onClick={() => setPreview(!preview)}
              >
                {preview ? "Edit" : "Preview"}
              </button>
            </div>

            <div className="p-3 space-y-5">
              <div className="flex justify-between space-x-5 overflow-x-auto">
                <AdminInput
                  label="Name"
                  value={name}
                  required={true}
                  onChange={(e: any) => setName(e.target.value)}
                  className="flex-[0.6]"
                  placeholder="New Page"
                />

                <AdminInput
                  label="Slug"
                  value={slug}
                  onChange={(e: any) => setSlug(e.target.value)}
                  className="flex-[0.4]"
                  placeholder="new-page"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <div className="text-base">Content</div>
                <TinyEditor preview={preview} content={content} setContent={setContent} />
              </div>
            </div>
          </div>

          <div className="flex-[0.3] flex flex-col space-y-5 min-w-52">
            <div className="bg-white p-5 rounded-lg shadow-lg space-y-5">
              <div className="text-lg pb-3 border-b-2 border-slate-100">
                Section & Category
              </div>

              <div className="flex flex-col space-y-2">
                <label>Category</label>

                <div className="flex items-center space-x-2">
                  {/* the path so they can see what they picked, / seperated, like maths / eg / eg */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selected
                      .map(
                        (id) =>
                          categories.find((category: any) => category.id === id)
                            ?.attributes.name
                      )
                      .join(" / ")}
                  </div>
                </div>

                <div className="overflow-x-auto max-w-96">
                  <CategorySelect
                    categories={categories}
                    setCategories={setCategories}
                    parent={null}
                    selected={selected}
                    setSelected={setSelected}
                    path={[]}
                    creating={creating}
                    setCreating={setCreating}
                    jwt={user.jwt}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-lg space-y-5">
              <div className="text-lg pb-3 border-b-2 border-slate-100">
                Other Settings
              </div>

              <div className="flex flex-col space-y-2">
                <label>Hero Image</label>

                {imageError && <div className="text-red-500">{imageError}</div>}

                <div className="flex items-center justify-center w-full">
                  <label
                    className={
                      "flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" +
                      (heroImage ? " border-gray-200" : " border-dashed")
                    }
                  >
                    {!heroImage ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-1 text-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.3}
                          stroke="currentColor"
                          className="size-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                          />
                        </svg>

                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">&lt; 20MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-5 items-center">
                        <button
                          className="w-fit bg-transparent text-gray-500 hover:bg-slate-200 text-xs font-medium px-3 py-1 rounded-md border-[1px] border-gray-300"
                          onClick={() => {
                            setHeroImage(null);
                            if (heroImageRef.current)
                              heroImageRef.current.value = "";
                          }}
                        >
                          Remove Image
                        </button>

                        <p className="text-xs text-gray-500">
                          {heroImage?.name}
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (
                          e.target.files &&
                          e.target.files[0].size > 10485760
                        ) {
                          setImageError("File size is too large. Max 20MB");
                          e.target.value = "";
                          return;
                        }

                        if (
                          e.target.files &&
                          !e.target.files[0].type.startsWith("image")
                        ) {
                          setImageError("File is not an image");
                          e.target.value = "";
                          return;
                        }

                        var formData = new FormData();
                        formData.append("files", e.target.files![0]);

                        fetchAPI("/api/upload", {
                          method: "POST",
                          rawBody: formData,
                        }).then(async (res) => {
                          if (!Array.isArray(res)) {
                            setImageError("Failed to upload image");
                            return;
                          }

                          setImageError(null);

                          let data = res[0];
                          setImage(data.id);
                          setHeroImage(data);
                        });
                      }}
                      ref={heroImageRef}
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col space-y-4 hidden">
                <div className="flex flex-col space-y-2">
                  <label>Tags</label>
                  <input
                    className="p-2 border-[1px] border-slate-200 bg-slate-50 shadow-sm rounded-md"
                    placeholder="updates, events, news"
                    onChange={(e) => setTags(mapTags(e.target.value))}
                    value={tags.join(", ")}
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {tags.length > 0 &&
                    tags.map(
                      (tag, index) =>
                        tag !== "" && (
                          <div
                            key={index}
                            className="bg-sky-400 text-white p-2 rounded-full text-xs font-medium px-3 cursor-pointer hover:bg-sky-500"
                            onClick={() =>
                              setTags(tags.filter((_, i) => i !== index))
                            }
                          >
                            {tag}
                          </div>
                        )
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
