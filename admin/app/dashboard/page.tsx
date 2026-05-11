'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Event = { id: string; title: string; date: string; type: string; status: string; spots?: number; spotsLeft?: number; location: string };
type Tab = 'published' | 'draft';

export default function DashboardPage() {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<Tab>('published');
  const [delId, setDelId]     = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getEvents('all');
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function toggleStatus(ev: Event) {
    if (ev.status === 'published') await api.unpublishEvent(ev.id);
    else await api.publishEvent(ev.id);
    load();
  }

  async function confirmDelete() {
    if (!delId) return;
    await api.deleteEvent(delId);
    setDelId(null);
    load();
  }

  const filtered = events.filter(e => e.status === tab);
  const published = events.filter(e => e.status === 'published').length;
  const drafts    = events.filter(e => e.status === 'draft').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>
          <p className="text-slate-500 text-sm mt-1">{published} published · {drafts} drafts</p>
        </div>
        <Link href="/events/new"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          New Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {(['published', 'draft'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              tab === t ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t} ({t === 'published' ? published : drafts})
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-slate-400">
          No {tab} events yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Title', 'Date', 'Type', 'Location', 'Spots', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-900 max-w-xs truncate">{ev.title}</td>
                  <td className="px-5 py-4 text-slate-600">{ev.date}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 capitalize">{ev.type}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-[140px] truncate">{ev.location}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {ev.spotsLeft != null ? `${ev.spotsLeft}/${ev.spots}` : ev.spots ?? '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/events/${ev.id}/edit`}
                        className="text-xs font-medium text-slate-600 hover:text-amber-600 transition-colors">Edit</Link>
                      <Link href={`/events/${ev.id}/subscribers`}
                        className="text-xs font-medium text-slate-600 hover:text-amber-600 transition-colors">Subscribers</Link>
                      <button onClick={() => toggleStatus(ev)}
                        className={`text-xs font-medium transition-colors ${
                          ev.status === 'published'
                            ? 'text-slate-500 hover:text-amber-600'
                            : 'text-green-600 hover:text-green-800'
                        }`}>
                        {ev.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => setDelId(ev.id)}
                        className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete modal */}
      {delId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-slate-900 mb-2">Delete event?</h3>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone. The event and its image will be permanently removed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDelId(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-100 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
