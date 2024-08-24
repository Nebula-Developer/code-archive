import { createDirectus, rest, RestCommand } from '@directus/sdk';
import { cookies } from 'next/headers';

const directus = createDirectus('http://localhost:8055', {

}).with(rest({
    onRequest: (options) => ({ ...options, cache: 'no-store' }),
    credentials: 'include'
}));

export async function authenticate(email, password) {
    try {
        // var res = directus.request(new RestCommand({ }))

        // return res;
    } catch (res) {
        console.log(res);
    }
}


export default directus;