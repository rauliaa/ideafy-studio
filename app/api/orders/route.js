// app/api/orders/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

// 🔍 GET semua pesanan
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: session.user.role === 'ADMIN'
      ? {} // admin bisa lihat semua
      : { userId: session.user?.id }, // user biasa hanya lihat pesanan miliknya
    include: {
      service: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(orders)
}

// ➕ Tambah pesanan
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { serviceId, brief } = body

  if (!serviceId || !brief) {
    return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 })
  }

  // 🛠️ Perbaikan di sini: tidak ada field `user`, cukup pakai `userId`
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      serviceId,
      brief,
      status: 'menunggu',
    },
    include: {
      service: true,
    },
  })

  return NextResponse.json(order, { status: 201 })
}
