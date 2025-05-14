import { atom } from "nanostores";
import { Models } from "appwrite";
import { account } from "@/lib/appwrite";

export const $user = atom<Models.User<Models.Preferences> | null>(null);
export const $userState = atom<UserState>('loading');

type UserState = 'none' | 'loading' | 'loggedIn';

export function logout() {
    account.deleteSession("current").then(() => {
        $user.set(null);
        $userState.set('none');
    }).catch((error) => {
        console.error("Error logging out:", error);
    });
}
