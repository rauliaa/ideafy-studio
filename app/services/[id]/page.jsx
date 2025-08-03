'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ServiceDetail() {
  const { id } = useParams()
  const [service, setService] = useState(null)

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((res) => res.json())
      .then(setService)
  }, [id])

  if (!service) return <p>Loading...</p>

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{service.title}</h1>
      <p className="mb-2">{service.description}</p>
      <p className="text-gray-600 mb-4">Harga: Rp {service.price}</p>
    </main>
  )
}
