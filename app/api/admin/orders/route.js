import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
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
