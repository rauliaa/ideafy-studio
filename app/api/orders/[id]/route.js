import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

// ❌ USER: Batalkan pesanan
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
  })

  if (!order) {
    return NextResponse.json({ message: 'Pesanan tidak ditemukan' }, { status: 404 })
  }

  if (order.userId !== session.user.id) {
    return NextResponse.json({ message: 'Akses ditolak' }, { status: 403 })
  }

  if (order.status !== 'menunggu') {
    return NextResponse.json(
      { message: 'Pesanan sudah diproses dan tidak bisa dibatalkan' },
      { status: 400 }
    )
  }

  await prisma.order.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ message: 'Pesanan dibatalkan' })
}

// 🟡 ADMIN: Update status pesanan
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { status } = body

  const validStatuses = ['menunggu', 'diproses', 'selesai']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 })
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status },
    include: {
      service: true,
      user: true,
    },
  })

  return NextResponse.json(updated)
}
