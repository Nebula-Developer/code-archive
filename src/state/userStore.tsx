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


(window as any).ipcRenderer?.on("oauth", (_: any, value: any) => {;
    console.log("OAuth result received:", value);
    if (typeof(value) == 'object' && value?.secret && value?.userId) {
        account.createSession(value.userId, value.secret).then(() => {
            $userState.set('loading');
        }).catch((error) => {
            console.error("Error creating session:", error);
            $userState.set('none');
            alert("Error creating session: " + error.message);
        });
    }
});
