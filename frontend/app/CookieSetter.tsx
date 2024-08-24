"use client";

import { useEffect } from "react";
import { setCookie } from "../lib/setCookie";

export default function CookieSetter({ cookie }: { cookie: string }) {
    useEffect(() => {
        console.log(cookie);
        setCookie("directus", decodeURIComponent(cookie));
    }, [cookie]);
    return (<></>);
}
