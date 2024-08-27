import {redirect} from "next/navigation";
import {Editor} from "@tinymce/tinymce-react";
import TinyEditor from "./TinyEditor";
import {EditorPanel} from "./EditorPanel";
import {AuthenticatedPage} from "../../../lib/pages";

export const dynamic = "force-dynamic";

function CategoryTree({all, parent, indent}: any) {
    indent = indent || 0;
    return (
        <div>
            {all
                .filter((category: any) =>
                    parent
                        ? category.attributes.category?.data?.id === parent
                        : !category.attributes.category?.data
                )
                .map((category: any) => (
                    <div key={category.id} className="ml-4">
                        {category.attributes.name}
                        <CategoryTree all={all} parent={category.id} indent={indent + 1}/>
                    </div>
                ))}
        </div>
    );
}

export default AuthenticatedPage(async ({user}) => {
    if (!user) return redirect("/login");

    const categories = [
        {
            id: 1,
            attributes: {
                name: "Root",
                category: {
                    data: null,
                },
            },
        },
        {
            id: 2,
            attributes: {
                name: "Child 1",
                category: {
                    data: {id: 1},
                },
            },
        },
        {
            id: 3,
            attributes: {
                name: "Child 2",
                category: {
                    data: {id: 1},
                },
            },
        },
        {
            id: 4,
            attributes: {
                name: "Child 3",
                category: {
                    data: {id: 2},
                },
            },
        },
    ]

    return <EditorPanel user={user} categoryFetch={categories}/>;
});
