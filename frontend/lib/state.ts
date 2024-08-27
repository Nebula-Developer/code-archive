import {User} from "./types";
import {ADMIN_ROLE} from "./directus";

let state = {
    user: null as User | null
};

export function setUser(user: User | null) {
    state.user = user;
}

export function getUser(): User | null {
    return state.user;
}

export function isLoggedIn(): boolean {
    return state.user !== null;
}

export function isAdmin(): boolean {
    console.log(state.user)
    return state.user?.role === ADMIN_ROLE;
}

export default state;
