'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Contact = { id: string; name: string; email: string; adventure?: string; message?: string; submittedAt: string; read: boolean };

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.getContacts()
      .then((d: Contact[]) => { setContacts(d); setLoading(false); });
  }, []);

  async function markRead(id: string) {
    await api.markContactRead(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
  }

  async function remove(id: string) {
    if (!confirm('Delete this message permanently?')) return;
    await api.deleteContact(id);
    setContacts(prev => prev.filter(c => c.id !== id));
  }

  const unread = contacts.filter(c => !c.read).length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Enquiries submitted via the website contact form.
          {unread > 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">{unread} unread</span>}
        </p>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-16">Loading…</div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-slate-400">No messages yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {contacts.map(c => (
            <div key={c.id} className={`bg-white rounded-2xl border shadow-sm p-6 ${c.read ? 'border-gray-100' : 'border-brand-primary/30 ring-1 ring-brand-primary/10'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    <a href={`mailto:${c.email}`} className="text-brand-primary text-sm hover:underline">{c.email}</a>
                    {!c.read && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-primary text-white font-medium">New</span>}
                  </div>
                  {c.adventure && <p className="text-xs text-slate-500 mb-2">Interest: <span className="font-medium">{c.adventure}</span></p>}
                  {c.message && <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.message}</p>}
                  <p className="text-xs text-slate-400 mt-2">{new Date(c.submittedAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {!c.read && (
                    <button onClick={() => markRead(c.id)}
                      className="px-4 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-olive transition-colors">
                      Mark Read
                    </button>
                  )}
                  <button onClick={() => remove(c.id)}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
