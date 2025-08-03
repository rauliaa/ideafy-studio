import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(req) {
  const body = await req.json();
  const { title, description, category, price, estimated, createdBy } = body;

  const newService = await prisma.service.create({
    data: {
      title,
      description,
      category,
      price: parseFloat(price),
      estimated,
      createdBy,
    },
  });

  return NextResponse.json(newService);
}
