'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function OrderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [services, setServices] = useState([])
  const [formData, setFormData] = useState({
    serviceId: '',
    brief: '',
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
  }, [status, session])

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert('Pesanan berhasil dikirim!')
      setFormData({ serviceId: '', brief: '' })
      router.push('/dashboard')
    } else {
      alert('Gagal mengirim pesanan.')
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Form Pemesanan Jasa</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Pilih Layanan</Label>
          <Select
            value={formData.serviceId}
            onValueChange={(value) =>
              setFormData({ ...formData, serviceId: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih layanan..." />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.title} – Rp {service.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Brief Desain</Label>
          <Textarea
            placeholder="Deskripsikan kebutuhan desain Anda"
            value={formData.brief}
            onChange={(e) =>
              setFormData({ ...formData, brief: e.target.value })
            }
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Kirim Pesanan
        </Button>
      </form>
    </main>
  )
}
