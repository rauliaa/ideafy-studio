'use client';
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="flex items-center gap-4">
        <span>Hi, {session?.user?.name || 'User'}</span>
        <LogoutButton />
      </div>
    </nav>
  );
}
