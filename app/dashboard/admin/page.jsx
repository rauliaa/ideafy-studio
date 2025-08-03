'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [services, setServices] = useState([])
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
  })

  // ⛔ Redirect jika bukan ADMIN
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/login')
    }
  }, [status, session])

  // ✅ Ambil semua layanan saat load
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
  }, [])

  // ✅ Tambah / Edit layanan
  const handleSubmit = async (e) => {
    e.preventDefault()

    const method = formData.id ? 'PUT' : 'POST'
    const url = formData.id ? `/api/services/${formData.id}` : '/api/services'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseInt(formData.price),
        createdBy: session?.user?.id,
      }),
    })

    const data = await res.json()

    if (method === 'POST') {
      setServices((prev) => [...prev, data])
    } else {
      setServices((prev) =>
        prev.map((s) => (s.id === data.id ? data : s))
      )
    }

    // Reset form
    setFormData({
      id: null,
      title: '',
      description: '',
      category: '',
      price: '',
      duration: '',
    })
  }

  // ❌ Hapus layanan
  const handleDelete = async (id) => {
    const confirmDelete = confirm('Yakin ingin menghapus layanan ini?')
    if (!confirmDelete) return

    await fetch(`/api/services/${id}`, {
      method: 'DELETE',
    })

    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* 🔧 FORM TAMBAH / EDIT */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <Input
          placeholder="Judul"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Textarea
          placeholder="Deskripsi"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <Input
          placeholder="Kategori"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
        <Input
          type="number"
          placeholder="Harga"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
        />
        <Input
          placeholder="Durasi (misal: 3 hari)"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
        />
        <Button type="submit" className="w-full">
          {formData.id ? 'Update Layanan' : 'Tambah Layanan'}
        </Button>
      </form>

      {/* 📄 TABEL LAYANAN */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Durasi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.title}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>Rp {service.price}</TableCell>
              <TableCell>{service.duration}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(service)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
