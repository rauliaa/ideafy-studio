'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // ✅ Tambahkan
import Link from 'next/link';

export default function UserDashboard() {
  const { data: session } = useSession();
  const router = useRouter(); // ✅ Tambahkan

  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [brief, setBrief] = useState('');

  // ✅ Tambahkan ini untuk redirect jika user adalah admin
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin/orders');
    }
  }, [session]);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data));

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ serviceId: selectedServiceId, brief }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const newOrder = await res.json();
      setOrders([newOrder, ...orders]);
      setBrief('');
    } else {
      alert('Gagal mengirim pesanan.');
    }
  };

  const handleCancel = async (id) => {
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Pengguna</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <select
          className="w-full border p-2 rounded"
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          required
        >
          <option value="">Pilih Layanan</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>

        <textarea
          className="w-full border p-2 rounded"
          rows="3"
          placeholder="Tulis brief..."
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          required
        />

        <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
          Kirim Pesanan
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Riwayat Pesanan</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Layanan</th>
            <th className="p-2 border">Brief</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="p-2 border">{order.service.title}</td>
              <td className="p-2 border">{order.brief}</td>
              <td className="p-2 border">{order.status}</td>
              <td className="p-2 border">
                {order.status === 'menunggu' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="text-red-600 hover:underline"
                  >
                    Batalkan
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
