'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import LogoutButton from './LogoutButton'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        Ideafy Studio
      </Link>

      {/* Navigasi */}
      <div className="flex gap-4 items-center">
        {session ? (
          <>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            {session.user.role === 'USER' && (
              <Link href="/orders" className="hover:underline">Pesanan</Link>
            )}
            <span>Hi, {session.user.name || 'User'}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className="hover:underline">Login</Link>
        )}
      </div>
    </nav>
  )
}
