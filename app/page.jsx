'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [services, setServices] = useState([])

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then(setServices)
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto bg-background min-h-screen">
  <h1 className="text-3xl font-bold mb-6 text-primary">Selamat Datang di Ideafy Studio</h1>
  <p className="mb-4 text-secondary">Pilih layanan desain digital yang kamu butuhkan</p>

  <div className="grid gap-4">
    {services.map((service) => (
      <div key={service.id} className="p-4 bg-white rounded shadow border border-neutral">
        <h2 className="text-xl font-semibold text-primary">{service.title}</h2>
        <p className="text-gray-700">{service.description}</p>
        <p className="text-sm text-secondary">Rp {service.price}</p>
      </div>
    ))}
  </div>
    </main>
  )
}
