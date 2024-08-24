"use client";

import Link from "next/link";
import { User } from "../../lib/types";
import { useEffect, useRef, useState } from "react";

export type NavbarItem = {
  name: string;
  href: string;
};

function NavbarItem({
  item,
  setOpen,
}: {
  item: NavbarItem;
  setOpen: (x: boolean) => void;
}) {
  return (
    <Link
      href={item.href}
      className="text-lg  p-5 h-full flex items-center justify-center"
      onClick={() => setOpen(false)}
    >
      {item.name}
    </Link>
  );
}

export default function Navbar({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);

  let items: NavbarItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  if (user !== null) {
    if (user.role === "admin")  {
        items.push({ name: "Admin", href: "/admin" });
    }
    items.push({ name: "Logout", href: "/logout" });
  } else {
    items.push({ name: "Login", href: "/login" });
    items.push({ name: "Register", href: "/register" });
  }

  const ref = useRef(null);

  useEffect(() => {
    function clickOffListener(event: MouseEvent) {
      if (ref.current && open && !event.composedPath().includes(ref.current)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", clickOffListener);
    return () => document.removeEventListener("click", clickOffListener);
  }, [open]);

  return (
    <div className="fixed top-0 left-0 w-full flex-shrink-0 h-32 bg-white shadow-xl z-[1000] flex justify-center">
      <div className="mx-5 h-full flex items-center justify-between w-full max-w-7xl">
        <Link className="flex flex-col justify-center items-center h-full px-5" href="/">
          <h1 className="text-2xl ">Ōtākaro Ako</h1>
          {/* <div className="text-sm ">Kia whakatōmuri te haere whakamua</div> */}
        </Link>

        <nav className="h-full flex">
          <div className="lg:hidden flex items-center h-full">
            <button
              onClick={() => setOpen(!open)}
              className=" text-lg  px-5 h-full flex items-center justify-center"
            >
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                  />
                </svg>
              )}
            </button>

            {open && (
              <div
                className="overflow-y-auto max-h-[calc(100vh-8rem)] absolute top-32 left-0 w-full bg-white shadow-xl z-[1000]"
                ref={ref}
              >
                {items.map((item) => (
                  <NavbarItem key={item.name} item={item} setOpen={setOpen} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:flex hidden h-full">
            {items.map((item) => (
              <NavbarItem key={item.name} item={item} setOpen={setOpen} />
            ))}
          </div>

          <Link
            href="/search"
            className="text-lg  p-5 h-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </Link>
        </nav>
      </div>
    </div>
  );
}
