"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import React, { useState, useRef, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Wand2, Home } from "lucide-react";

const Navbar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const user: User = session?.user;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when navigating
  const handleNavigation = () => {
    setProfileDropdownOpen(false);
  };

  return (
    <div
      className={cn("top-15 mt-5 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
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
            <Link href="/dashboard">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Dashboard"
              ></MenuItem>
            </Link>
            <Link href="/feedback-pages">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Pages"
              ></MenuItem>
            </Link>
            <Link
              href="/ai-assistant"
              className="text-sm font-medium flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Wand2 className="h-4 w-4" />
              AI Assistant
            </Link>
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <UserCircleIcon className="h-6 w-6 text-black dark:text-white" />
                <span className="ml-1 text-black dark:text-white">
                  {user.username || user.email}
                </span>
                <ChevronDownIcon className="h-4 w-4 ml-1 text-black dark:text-white" />
              </div>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium text-black dark:text-white truncate">
                      {user.username || user.email}
                    </p>
                  </div>
                  <Link href="/profile" onClick={handleNavigation}>
                    <div className="px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Edit Profile
                    </div>
                  </Link>
                  <div
                    className="px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      signOut({
                        callbackUrl: process.env.NEXTAUTH_URL,
                        redirect: true,
                      });
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
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
  );
};

export default Navbar;
