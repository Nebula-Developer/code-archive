import { Client, Account, Databases, Storage } from "appwrite";

let _client: Client | null = null;
let _account: Account | null = null;
let _databases: Databases | null = null;
let _storage: Storage | null = null;

function getClient() {
    if (_client) return _client;

    if (typeof window === "undefined") {
        return new Client();
    }

    const client = new Client();
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    _client = client;
    return client;
}

export function getAccount() {
    if (!_account) _account = new Account(getClient());
    return _account;
}

export function getDatabases() {
    if (!_databases) _databases = new Databases(getClient());
    return _databases;
}

export function getStorage() {
    if (!_storage) _storage = new Storage(getClient());
    return _storage;
}

export const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
