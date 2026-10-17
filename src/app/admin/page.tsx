'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, CheckCircle, Clock, Truck, RefreshCw, Eye } from 'lucide-react';

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  package_name: string;
  package_qty: number;
  package_price: number;
  delivery_area: string;
  delivery_charge: number;
  total_amount: number;
  order_type: string;
  status: string;
  notes: string;
  created_at: string;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'delivered'>('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900">
              অর্ডার ম্যানেজমেন্ট ড্যাশবোর্ড
            </h1>
            <p className="text-xs text-stone-500">Barakah Mart BD - সুন্দরবনের খাঁটি কাঁচা মধু সেলস ট্র্যাকার</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> রিফ্রেশ
            </button>
            <a
              href="/"
              target="_blank"
              className="px-4 py-2 bg-[#9B3D13] text-white rounded-xl text-xs font-bold hover:bg-[#7A2E0E] flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" /> লাইভ পেজ দেখুন
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs text-stone-500">মোট অর্ডার</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{orders.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs text-stone-500">অপেক্ষমাণ (Pending)</span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {orders.filter((o) => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs text-stone-500">কনফার্মড অর্ডার</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {orders.filter((o) => o.status === 'confirmed').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs text-stone-500">মোট বিক্রয় মূল্য</span>
            <div className="text-2xl font-black text-[#9B3D13] mt-1">৳{totalRevenue}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(['all', 'pending', 'confirmed', 'delivered'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition ${
                filter === tab
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {tab === 'all' ? 'সব অর্ডার' : tab === 'pending' ? 'পেন্ডিং' : tab === 'confirmed' ? 'কনফার্ম' : 'ডেলিভার্ড'}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-stone-500">অর্ডার ডাটা লোড হচ্ছে...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">এখনো কোনো অর্ডার পাওয়া যায়নি।</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3">অর্ডার আইডি</th>
                    <th className="px-4 py-3">গ্রাহকের নাম ও ফোন</th>
                    <th className="px-4 py-3">ঠিকানা</th>
                    <th className="px-4 py-3">প্যাকেজ</th>
                    <th className="px-4 py-3">টাকার পরিমাণ</th>
                    <th className="px-4 py-3">টাইপ</th>
                    <th className="px-4 py-3">স্ট্যাটাস</th>
                    <th className="px-4 py-3">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50">
                      <td className="px-4 py-3 font-mono font-bold text-stone-800">
                        {order.order_id}
                        <div className="text-[10px] text-stone-400 font-normal">{order.created_at}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-stone-800">{order.customer_name}</div>
                        <a href={`tel:${order.customer_phone}`} className="text-[#9B3D13] font-medium hover:underline">
                          {order.customer_phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 max-w-xs text-stone-600">
                        {order.customer_address}
                        <div className="text-[10px] text-stone-400">({order.delivery_area})</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-800">
                        {order.package_name}
                      </td>
                      <td className="px-4 py-3 font-bold text-stone-900">
                        ৳{order.total_amount}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.order_type === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.order_type === 'whatsapp' ? 'WhatsApp' : 'Form'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                          order.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'delivered'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.order_id, e.target.value)}
                          className="bg-stone-50 border border-stone-300 text-[11px] rounded-lg px-2 py-1 text-stone-700 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
