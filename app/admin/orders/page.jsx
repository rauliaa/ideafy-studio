'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [orders, setOrders] = useState([])

  // 🔐 Hanya admin yang bisa akses
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/login')
    }
  }, [session, status])

  // 📦 Ambil semua pesanan
  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
  }, [])

  // 🔁 Update status pesanan
  const updateStatus = async (orderId, newStatus) => {
    const confirmUpdate = confirm(`Ubah status menjadi ${newStatus}?`)
    if (!confirmUpdate) return

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      const updated = await res.json()
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      )
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manajemen Pesanan</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Layanan</TableHead>
            <TableHead>Brief</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {Array.isArray(orders) && orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.service.title}</TableCell>
              <TableCell>{order.brief}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {order.status !== 'selesai' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => updateStatus(order.id, 'diproses')}
                      >
                        Proses
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateStatus(order.id, 'selesai')}
                      >
                        Selesai
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
