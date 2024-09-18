import React from "react";
import {setCookie} from "../lib/setCookie";
import {Page} from "../lib/pages";
import Image from "next/image";
import directus from "../lib/directus";
import {readItems} from "@directus/sdk";
import HomeSearch from "./components/HomeSearch";
import PageCard from "./components/PageCard";

export const dynamic = 'force-dynamic';

export default Page(async () => {
    let pages: any[];

    try {
        pages = await directus.request(readItems('pages', {
          fields: ['title', 'hero', 'category.name', 'category.id', 'id', 'tags'],
          sort: [ "-date_created" ],
          limit: 6
        }));
    } catch (e) {
        console.error(e);
    }

    return (
        <main>
            <div className="w-full p-20 min-h-72 md:min-h-96 border-b-2 border-gray-200 relative">
                <Image src="/images/Estuary5.jpg" layout="fill" objectFit="cover" alt="Home background"/>
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"/>

                <div className="absolute bottom-0 left-0 m-5 md:m-12">
                    <h1 className="text-2xl md:text-4xl  text-white">Ōtākaro Kahui Ako</h1>
                    <p className="text-sm md:text-lg  text-white">A platform for sharing educational resources between
                        local schools</p>
                </div>
            </div>
            
            {pages && (
                <div className="container mx-auto px-5 py-20">
                    <h2 className="text-2xl md:text-3xl  mb-6">Recently Updated Pages</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pages.map((page) => (
                            <PageCard key={page.id} page={page}/>
                        ))}
                    </div>

                    <div className="mt-12">
                        <div className="text-base text-gray-400 ">Search</div>
                        <HomeSearch/>
                    </div>
                </div>
            )
            }

            {/* a quick summary of the page */}
            <div className="p-20 border-t-2 border-gray-200 bg-gray-100">
                <h2 className="text-2xl md:text-3xl  mb-6">About Ōtākaro Ako</h2>
                <p className="text-lg ">
                    Ōtākaro Ako is a platform for Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
                    dolorem labore itaque quo aliquid doloremque nulla, facere ex minima eligendi at accusantium nam
                    nobis error voluptate, id veniam ullam magnam. Velit consequatur minus sequi ullam, ea aperiam illum
                    quam cum reiciendis hic corporis facilis vero est quasi. Qui quisquam, maiores placeat debitis
                    laborum aperiam cumque deleniti, blanditiis quas totam numquam. Eius consequatur illum minima odio
                    ad distinctio corporis quam doloremque natus consequuntur impedit dolores eum officiis est culpa,
                    illo nemo numquam corrupti mollitia accusamus qui delectus! Illo, saepe corporis mollitia hic
                    repellat aperiam? Necessitatibus voluptatum consectetur quam dolores, inventore repudiandae.
                </p>
            </div>
        </main>
    );
});
