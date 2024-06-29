"use client";

import Link from "next/link";
import { useState } from "react";

function navLink(text: string, href: string, setOpen: (open: boolean) => void) {
  return (
    <Link
      href={href}
      className="sm:px-5 text-base h-full flex items-center justify-center hover:bg-slate-100 sm:py-0 py-5"
      onClick={() => setOpen(false)}
    >
      {text}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 left-0 w-screen h-20 text-gray-800 flex items-center justify-center border-b border-gray-200 bg-white z-[1000] shadow-md">
      <div className="h-full w-[calc(100%-60px)] max-w-7xl flex items-center justify-between">
        <a href="/" className="sm:text-xl text-lg font-medium">
          Anxious Doggy
        </a>

        <div
          className="sm:hidden text-2xl cursor-pointer h-20 w-20 flex items-center justify-center translate-x-5"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>

        <div
          className={`overflow-y-auto max-h-[calc(100vh-5rem)] sm:flex flex-col sm:flex-row sm:space-y-0 ${
            open ? "flex" : "hidden"
          } sm:h-full sm:static absolute top-20 left-0 sm:w-fit w-full sm:bg-transparent bg-white sm:border-none border-b border-gray-200`}
        >
          {navLink("Home", "/", setOpen)}
          {navLink("About", "/about", setOpen)}
          {navLink("Contact", "/contact", setOpen)}
          {navLink("Form", "/form", setOpen)}
          {navLink("Login", "/login", setOpen)}
        </div>
      </div>
    </div>
  );
}
