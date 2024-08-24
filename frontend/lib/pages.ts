import { notFound } from "next/navigation";
import { User } from "./types";
import { isAdmin, setUser } from "./state";
import { cookies } from "next/headers";
import directus, { storage } from "./directus";
import { login, refresh } from "@directus/sdk";

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
  return (props: NextPageProps) => {
    let user: User | null = {
      id: 1,
      username: "admin",
      email: "admin@test.com",
      password: "admin",
      role: "admin",
      jwt: "test"
    };

    var cookie = cookies().get("directus") as any;

    try {
      storage.data = JSON.parse(cookie.value);

      directus.refresh().then((res) => {
        storage.data = res;
      }).catch((err) => {
        console.error(err);
      });
    } catch { }

    directus.login('nebuladev.contact@gmail.com', 'mazzys123').then((res) => {
      storage.data = res;
    }).catch((err) => {
      console.error(err);
    });


    // if (!cookies().has("user")) user = null;

    let userProps: UserPageProps = {
      user,
      params: props.params,
      searchParams: props.searchParams,
    };

    setUser(userProps.user);

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
): NextPage {
  return Page(page, [() => (isAdmin() ? 200 : 403), ...middleware]);
}
