"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const { message } = await res.json();
      alert(message || "Gagal mendaftar");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F9F3EF] px-4">
      <form
  onSubmit={handleSubmit}
  className="space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-[#D2C1B6] text-[#1B3C53]"
>
  <h2 className="text-2xl font-bold text-center">Register</h2>

  <input
    type="text"
    name="name"
    placeholder="Nama"
    onChange={handleChange}
    required
    className="border border-[#D2C1B6] p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#456882] placeholder:text-[#9CA3AF] text-[#1B3C53]"
  />

  <input
    type="email"
    name="email"
    placeholder="Email"
    onChange={handleChange}
    required
    className="border border-[#D2C1B6] p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#456882] placeholder:text-[#9CA3AF] text-[#1B3C53]"
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    required
    className="border border-[#D2C1B6] p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#456882] placeholder:text-[#9CA3AF] text-[#1B3C53]"
  />

  <button
    type="submit"
    className="bg-[#1B3C53] hover:bg-[#456882] text-white font-semibold py-3 px-4 rounded shadow w-full transition duration-300"
  >
    Daftar Sekarang
  </button>
      </form>
    </main>
  );
}
