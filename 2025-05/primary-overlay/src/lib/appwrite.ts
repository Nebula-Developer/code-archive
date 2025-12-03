import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://app.nebuladev.net/v1')
    .setProject('nebula');

export const account = new Account(client);
export { ID } from 'appwrite';
