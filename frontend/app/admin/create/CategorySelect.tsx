'use client';

import {useEffect, useState} from "react";

export function CategorySelect({
                                   categories, // all categories
                                   setCategories, // set all categories
                                   parent, // parent category by id
                                   selected, // selected category by list of ids (the path)
                                   setSelected, // set selected category
                                   path, // current path
                                   creating, // creating a new category
                                   setCreating, // set creating a new category
                                   jwt,
                               }: {
    categories: any[];
    setCategories: (categories: any[]) => void;
    parent: number | null;
    selected: number[];
    setSelected: (selected: number[]) => void;
    path: number[];
    creating: boolean;
    setCreating: (creating: boolean) => void;
    jwt: string;
}) {
    const [children, setChildren] = useState<any[]>([]);
    const [selfCreating, selfSetCreating] = useState<boolean>(false);
    const [newCategory, setNewCategory] = useState<string>("");

    useEffect(() => {
        setChildren(
            categories.filter((category) => {
                if (parent == null) return category.attributes.category?.data === null;
                return category.attributes.category.data?.id === parent;
            })
        );
    }, [parent, categories]);

    function show(category: any): boolean {
        return !(
            category.attributes.category?.data === null &&
            selected.length > 0 &&
            !selected.includes(category.id)
        );
    }

    return (
        <div className="flex flex-col space-y-1 whitespace-nowrap">
            {children.map((category) => (
                <div
                    key={category.id}
                    className={
                        "flex items-start space-x-2 cursor-pointer" +
                        (selected.includes(category.id) ? "text-sky-500" : "text-black") +
                        (show(category) ? "" : " hidden")
                    }
                >
                    {show(category) && (
                        <div
                            onClick={() => {
                                setCreating(false);
                                selfSetCreating(false);

                                if (selected.includes(category.id))
                                    setSelected(selected.slice(0, selected.indexOf(category.id)));
                                else setSelected(path.concat(category.id));
                            }}
                            className="cursor-pointer flex items-center space-x-2"
                        >
                            <div
                                className={
                                    "w-2 h-2 rounded-full bg-sky-500 " +
                                    (selected.includes(category.id)
                                        ? "bg-sky-500"
                                        : "bg-slate-200")
                                }
                            ></div>
                            <div
                                className={
                                    "text-sm " +
                                    (selected.includes(category.id)
                                        ? "text-sky-500"
                                        : "text-black")
                                }
                            >
                                {category.attributes.name}
                            </div>
                        </div>
                    )}

                    {selected.includes(category.id) && (
                        <CategorySelect
                            categories={categories}
                            setCategories={setCategories}
                            parent={category.id}
                            selected={selected}
                            setSelected={setSelected}
                            path={path.concat(category.id)}
                            creating={creating}
                            setCreating={setCreating}
                            jwt={jwt}
                        />
                    )}
                </div>
            ))}

            <div>
                {creating && selfCreating ? (
                    <div className="flex flex-col space-y-2 m-2 w-fit">
                        <input
                            type="text"
                            className="p-2 border-[1px] border-slate-200 rounded-md text-sm outline-none"
                            placeholder="New Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button
                            className="bg-green-500 text-white px-3 py-1 rounded-md"
                            onClick={() => {
                                setCreating(false);
                                selfSetCreating(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-sky-500 text-white px-3 py-1 rounded-md"
                            onClick={() => {

                            }}
                        >
                            Create
                        </button>
                    </div>
                ) : !creating ? (
                    <button
                        className="text-sm flex items-center space-x-1 text-gray-400 hover:text-gray-500"
                        onClick={() => {
                            setCreating(true);
                            selfSetCreating(true);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            className="size-3 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>

                        <span className="text-xs">New</span>
                    </button>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
