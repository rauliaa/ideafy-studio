import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Selamat datang, {session?.user?.name || 'User'}!</h2>
        <p className="text-gray-700">Ini adalah halaman dashboard kamu.</p>
      </div>
    </main>
  );
}
