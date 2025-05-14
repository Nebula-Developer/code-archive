import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://app.nebuladev.net/v1')
    .setProject('68245363001c7c811193'); // Replace with your project ID

export const account = new Account(client);
export { ID } from 'appwrite';
