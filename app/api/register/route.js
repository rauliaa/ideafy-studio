import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER", // default role
    },
  });

  return NextResponse.json({ message: "Berhasil mendaftar" }, { status: 201 });
}
