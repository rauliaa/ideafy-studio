'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [brief, setBrief] = useState('')

  // ⛔ Redirect jika bukan USER
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'USER') {
      router.push('/login')
    }
  }, [status, session])

  // Ambil layanan & pesanan user
  useEffect(() => {
    if (session) {
      fetch('/api/services')
        .then((res) => res.json())
        .then(setServices)

      fetch('/api/orders')
        .then((res) => res.json())
        .then(setOrders)
    }
  }, [session])

  // ✅ Submit pemesanan
  const handleOrder = async () => {
    if (!selectedService || !brief.trim()) {
      alert('Mohon lengkapi layanan dan brief.')
      return
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: selectedService,
        brief,
      }),
    })

    if (res.ok) {
      const newOrder = await res.json()
      setOrders((prev) => [newOrder, ...prev])
      setBrief('')
      setSelectedService('')
    } else {
      alert('Gagal mengirim pesanan.')
    }
  }

  // ❌ Batalkan pesanan
  const cancelOrder = async (id) => {
    const confirmCancel = confirm('Yakin ingin membatalkan pesanan ini?')
    if (!confirmCancel) return

    const res = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id))
    } else {
      alert('Gagal membatalkan pesanan.')
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Pengguna</h1>

      {/* 📋 Form Pemesanan */}
      <div className="space-y-4 mb-10">
        <select
          className="w-full border rounded p-2"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">-- Pilih Layanan --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} - Rp {s.price}
            </option>
          ))}
        </select>

        <Textarea
          placeholder="Tuliskan kebutuhan/deskripsi Anda"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />

        <Button onClick={handleOrder} className="w-full">
          Kirim Pesanan
        </Button>
      </div>

      {/* 📄 Riwayat Pemesanan */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Layanan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Brief</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Belum ada pesanan.
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.service?.title}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.brief}</TableCell>
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
    </main>
  )
}
