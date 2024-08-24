import { authentication, AuthenticationData, createDirectus, rest, RestCommand } from '@directus/sdk';
import { cookies } from 'next/headers';

class DirectusStorage {
    data = {};
    async get(): Promise<AuthenticationData> {
        console.log("GETTING DATA", this.data);
        return this.data as any;
    }
    set(data) { }
}

export const storage = new DirectusStorage();

const directus = createDirectus('http://directus:8055', {

}).with(rest({
    onRequest: (options) => ({ ...options, cache: 'no-store' }),
    credentials: 'include'
})).with(authentication('json', {
    storage,
    credentials: 'include'
}));

export default directus;