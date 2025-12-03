import React from "react"
import "./globals.css"
import Navbar from "./components/Navbar"
import {getUser, isAdmin} from "../lib/state"
import Footer from "./components/Footer";

export const metadata = {
    title: 'Ōtākaro Kahui Ako',
    description: 'A platform for sharing educational resources between local schools.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className="flex flex-col h-screen min-h-fit overflow-x-hidden max-w-[100vw]">
        <Navbar user={getUser()} admin={isAdmin()}/>
        <div className="flex-grow mt-32">
            {children}
        </div>
        <Footer/>
        </body>
        </html>
    )
}
