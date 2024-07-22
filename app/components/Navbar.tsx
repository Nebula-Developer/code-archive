"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Indie_Flower } from 'next/font/google'

function navLink(text: string, href: string, setOpen: (open: boolean) => void) {
  return (
    <Link
      href={href}
      className="md:px-5 text-base h-full flex items-center justify-center hover:bg-slate-100 md:py-0 py-5 hover:transition-none transition-colors duration-75"
      onClick={() => setOpen(false)}
    >
      {text}
    </Link>
  );
}

const indie = Indie_Flower({
  subsets: ['latin'],
  weight: "400"
});

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 left-0 w-screen h-20 text-gray-800 flex items-center justify-center border-b border-gray-200 bg-white z-[1000] shadow-md select-none">
      <div className="h-full w-[calc(100%-60px)] max-w-7xl flex items-center justify-between">
        <a href="/" className={"md:text-2xl text-xl font-medium flex items-center " + indie.className}>
          <Image className="mr-4" src="/Logo.png" width={40} height={40} alt="Anxious Doggy" />
          <span className="translate-y-1 text-blue-400 hover:text-blue-300">
            Anxious Doggy
          </span>
        </a>

        <div
          className="md:hidden text-2xl cursor-pointer h-20 w-20 flex items-center justify-center translate-x-5"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>

        <div
          className={`overflow-y-auto max-h-[calc(100vh-5rem)] md:flex flex-col md:flex-row md:space-y-0 ${
            open ? "opacity-100" : "md:opacity-100 opacity-0 md:translate-y-0 md:pointer-events-auto pointer-events-none -translate-y-5"
          } md:h-full md:static flex absolute top-20 left-0 md:w-fit w-full md:bg-transparent bg-white md:border-none border-b border-gray-200`}
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
