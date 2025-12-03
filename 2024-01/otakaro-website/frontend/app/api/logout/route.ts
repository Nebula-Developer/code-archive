import {cookies} from "next/headers";

export function GET() {
    cookies().delete('token');
    return new Response(null, {
        status: 302,
        headers: {
            'Location': '/'
        },
    });
}
