import { User } from "./types";

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
  return state.user?.role === "admin";
}

export default state;
