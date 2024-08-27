import {notFound} from "next/navigation";
import {User} from "./types";
import {isAdmin, setUser} from "./state";
import {cookies} from "next/headers";
import directus, {storage} from "./directus";
import {login, readMe, refresh} from "@directus/sdk";

export type NextPageProps = {
    params: Record<string, string>;
    searchParams: Record<string, string>;
};

export type UserPageProps = {
    user: User | null;
} & NextPageProps;

export type NextPage = (props: NextPageProps) => JSX.Element | Promise<JSX.Element>;
export type UserPage = (props: UserPageProps) => JSX.Element | Promise<JSX.Element>;
export type Middleware = (props: UserPageProps) => number;

export function Page(page: UserPage, middleware: Middleware[] = []): NextPage {
    return async (props: NextPageProps) => {
        let user: any | null = null;

        try {
            var cookie = cookies().get("token") as any;
            storage.data = JSON.parse(cookie.value);

            var login = await directus.login('nebuladev.contact@gmail.com', 'mazzys123');
            storage.data = login;
            console.log("cookie value:", login)

            user = await directus.request(readMe({
                fields: [
                    'id', 'email', 'first_name', 'last_name', 'role'
                ]
            }));
        } catch {
            console.log("failed, logging in.");
            storage.data = null;
        }


        // if (!cookies().has("user")) user = null;

        let userProps: UserPageProps = {
            user,
            params: props.params,
            searchParams: props.searchParams,
        };

        setUser(user);

        for (let i = 0; i < middleware.length; i++) {
            switch (middleware[i](userProps)) {
                case 200:
                    break;
                default:
                    return notFound();
            }
        }

        return page(userProps);
    };
}

export function AuthenticatedPage(
    page: UserPage,
    middleware: Middleware[] = []
) {
    return Page(page, [() => (isAdmin() ? 200 : 403), ...middleware]);
}
