import {authentication, AuthenticationData, createDirectus, readItems, rest, RestCommand} from '@directus/sdk';
import {cookies} from 'next/headers';

export const ADMIN_ROLE = "9fa25a08-fb14-4706-bc80-6794987342f1";
export const API_URL = process.env.API_URL ?? "http://localhost:8055/";

class DirectusStorage {
    data = {};

    async get(): Promise<AuthenticationData> {
        // console.log("GETTING DATA", this.data);
        return this.data as any;
    }

    set(data) {
        // this.data = data;
    }
}

export const storage = new DirectusStorage();

const directus = createDirectus('http://directus:8055', {}).with(rest({
    onRequest: (options) => ({...options, cache: 'no-store'}),
    credentials: 'include'
})).with(authentication('json', {
    storage,
    credentials: 'include'
}));

export default directus;