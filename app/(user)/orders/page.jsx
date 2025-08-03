'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
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

export default function UserOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [orders, setOrders] = useState([])

  // ⛔ Redirect jika belum login
  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
  }, [status, session])

  // ✅ Ambil pesanan user
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  // ❌ Batalkan pesanan
  const cancelOrder = async (orderId) => {
    const confirmCancel = confirm('Batalkan pesanan ini?')
    if (!confirmCancel) return

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    } else {
      alert('Gagal membatalkan pesanan.')
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Riwayat Pesanan Anda</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Layanan</TableHead>
              <TableHead>Brief</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.service.title}</TableCell>
                <TableCell>{order.brief}</TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell>
                  {order.status === 'menunggu' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Batalkan
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  )
}
