'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Sub = { id: string; name: string; email: string; phone?: string; numberOfPeople?: number; notes?: string; registeredAt: string };

export default function SubscribersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [subs, setSubs]     = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    api.getEvent(id).then((ev: { title?: string }) => setEventTitle(ev.title ?? ''));
    api.getSubscriptions(id).then((data: Sub[]) => { setSubs(data); setLoading(false); });
  }, [id]);

  async function remove(subId: string) {
    await api.deleteSubscription(subId);
    setSubs(prev => prev.filter(s => s.id !== subId));
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" className="text-slate-400 hover:text-amber-600 text-sm transition-colors">← Events</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 text-sm truncate max-w-xs">{eventTitle}</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Subscribers</h1>
      <p className="text-slate-500 text-sm mb-8">{subs.length} registered</p>

      {loading ? (
        <div className="text-slate-400 text-center py-16">Loading…</div>
      ) : subs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-slate-400">No subscribers yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Phone', 'People', 'Notes', 'Registered', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subs.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-slate-900">{s.name}</td>
                  <td className="px-5 py-4 text-slate-600">{s.email}</td>
                  <td className="px-5 py-4 text-slate-600">{s.phone ?? '—'}</td>
                  <td className="px-5 py-4 text-slate-600 text-center">{s.numberOfPeople ?? 1}</td>
                  <td className="px-5 py-4 text-slate-500 max-w-[180px] truncate">{s.notes ?? '—'}</td>
                  <td className="px-5 py-4 text-slate-400 text-xs">{new Date(s.registeredAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => remove(s.id)} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
