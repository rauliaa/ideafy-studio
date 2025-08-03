"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!result.error) {
      router.push("/dashboard");
    } else {
      alert("Email atau password salah!");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
    </main>
  );
}
