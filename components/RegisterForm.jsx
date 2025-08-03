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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Nama"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
        Register
      </button>
    </form>
  );
}
