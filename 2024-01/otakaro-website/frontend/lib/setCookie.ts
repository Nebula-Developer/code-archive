'use server';

import { cookies } from "next/headers";

export async function setCookie(cookie: string, value: string) {
    cookies().set(cookie, value, {
        httpOnly: true,
        path: '/'
    });
}
