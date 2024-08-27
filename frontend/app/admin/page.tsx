import Image from "next/image";
import { AuthenticatedPage } from "../lib/pages";
import { API_URL } from "../lib/api";

function AdminGridItem({ name, location, image, inactive }: { name: string; location: string; image: string, inactive?: boolean }) {
    return (
        <a href={location} className={`w-full bg-white shadow-xl rounded-lg hover:scale-105 transition-transform duration-200 border border-gray-200 overflow-hidden pb-5 ${inactive ? "opacity-50 pointer-events-none" : ""}`}>
            <Image src={image} className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-lg" alt={name} width="1080" height="720" />
            <h1 className="text-2xl px-5 mt-5">{name}</h1>
        </a>
    );
}

export default AuthenticatedPage(() => {
    return (
        <div className="flex flex-col items-center my-20 mx-12">
            <div className="text-3xl mb-12">Admin Page</div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AdminGridItem name="Create New Page" location="/admin/create" image="/images/Estuary2.jpg" />
                <AdminGridItem inactive={true} name="Edit Page" location="/admin/edit" image="/images/Estuary3.jpg" />
                <AdminGridItem inactive={true} name="Admin Console" location={API_URL + "admin"} image="/images/Estuary4.jpg" />
            </div>
        </div>
    );
});
