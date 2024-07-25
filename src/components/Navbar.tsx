'use client'

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link'
import { User } from 'next-auth';

const Navbar = () => {
    const { data: session } = useSession()
    const user : User = session?.user;
    
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white">
          <Link href="/">
              <div className="text-xl font-bold">MyApp</div>
          </Link>
        </div>
        <div>
          {session ? (
            <div className="flex items-center">
              <span className="text-white mr-4">Welcome, {user.username || user.email}</span>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" 
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
                <Link href="/sign-in">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2" 
              >
                Sign In
              </button>
                </Link>
              <Link href="/sign-up">
                <div className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                  Sign Up
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
