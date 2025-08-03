import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  const body = await req.json();
  const { title, description, category, price, estimated } = body;

  const updated = await prisma.service.update({
    where: { id: params.id },
    data: {
      title,
      description,
      category,
      price: parseFloat(price),
      estimated,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await prisma.service.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Layanan dihapus" });
}
