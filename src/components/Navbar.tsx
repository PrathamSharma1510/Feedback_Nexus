"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";

const Navbar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <div
      className={cn("top-15 mt-5 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      {" "}
      <Menu setActive={setActive}>
        <Link href="/">
          <MenuItem
            setActive={setActive}
            active={active}
            item="Home"
          ></MenuItem>
        </Link>
        {session ? (
          <>
            <MenuItem setActive={setActive} active={active} item="Profile">
              {user.username || user.email}
            </MenuItem>
            <Link href={"/dashboard"}>
              <MenuItem
                setActive={setActive}
                active={active}
                item="Dashboard"
              ></MenuItem>
            </Link>
            <div onClick={() => signOut()}>
              <MenuItem
                setActive={setActive}
                active={active}
                item="Logout"
              ></MenuItem>
            </div>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Sign in"
              ></MenuItem>
            </Link>
            <Link href="/sign-up">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Register"
              ></MenuItem>
            </Link>
          </>
        )}
      </Menu>
    </div>
    //   <nav className="bg-gray-800 p-4">
    //     <div className="container mx-auto flex justify-between items-center">
    //       <div className="text-white">
    //         <Link href="/">
    //           <div className="text-xl font-bold">MyApp</div>
    //         </Link>
    //       </div>
    //       <div>
    //         {session ? (
    //           <div className="flex items-center">
    //             <span className="text-white mr-4">
    //               Welcome, {user.username || user.email}
    //             </span>
    //             <button
    //               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
    //               onClick={() => signOut()}
    //             >
    //               Logout
    //             </button>
    //           </div>
    //         ) : (
    //           <div>
    //             <Link href="/sign-in">
    //               <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
    //                 Sign In
    //               </button>
    //             </Link>
    //             <Link href="/sign-up">
    //               <div className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
    //                 Sign Up
    //               </div>
    //             </Link>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </nav>
  );
};

export default Navbar;
