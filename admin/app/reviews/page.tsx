'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Review = { id: string; eventId: string; eventTitle?: string; author: string; email?: string; rating: number; text: string; submittedAt: string; status: 'pending' | 'approved' | 'rejected'; featured?: boolean };
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const TABS: StatusFilter[] = ['all', 'pending', 'approved', 'rejected'];
const MAX_FEATURED = 3;

const STATUS_COLORS: Record<string, string> = {
  pending:  'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-green-50  text-green-700  border-green-200',
  rejected: 'bg-red-50    text-red-700    border-red-200',
};

export default function ReviewsPage() {
  const [reviews, setReviews]   = useState<Review[]>([]);
  const [tab, setTab]           = useState<StatusFilter>('pending');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAllReviews(tab === 'all' ? undefined : tab)
      .then((d: Review[]) => { setReviews(d); setLoading(false); });
  }, [tab]);

  const featuredCount = reviews.filter(r => r.featured && r.status === 'approved').length;

  async function setStatus(id: string, status: 'approved' | 'rejected') {
    await api.updateReviewStatus(id, { status });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  async function toggleFeatured(r: Review) {
    if (!r.featured && featuredCount >= MAX_FEATURED) return;
    await api.updateReviewStatus(r.id, { featured: !r.featured });
    setReviews(prev => prev.map(x => x.id === r.id ? { ...x, featured: !r.featured } : x));
  }

  async function remove(id: string) {
    if (!confirm('Delete this review permanently?')) return;
    await api.deleteReview(id);
    setReviews(prev => prev.filter(r => r.id !== id));
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-1 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-500 text-sm mt-0.5">Moderate visitor reviews before they appear on the public site.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${featuredCount >= MAX_FEATURED ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-gray-50 border-gray-200 text-slate-600'}`}>
          <span>⭐ Featured on homepage:</span>
          <span className={`font-bold ${featuredCount >= MAX_FEATURED ? 'text-amber-700' : 'text-slate-900'}`}>
            {featuredCount} / {MAX_FEATURED}
          </span>
          {featuredCount >= MAX_FEATURED && <span className="text-xs text-amber-600">(limit reached)</span>}
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit mt-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-16">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-slate-400">No reviews in this category.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{r.author}</span>
                    {r.email && <span className="text-slate-400 text-sm">{r.email}</span>}
                    <span className="text-amber-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                    {r.featured && <span className="text-xs px-2 py-0.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 font-medium">⭐ Featured</span>}
                  </div>
                  {r.eventTitle && <p className="text-xs text-slate-400 mb-2">Event: {r.eventTitle}</p>}
                  <p className="text-slate-700 text-sm leading-relaxed">{r.text}</p>
                  <p className="text-xs text-slate-400 mt-2">{new Date(r.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {r.status !== 'approved' && (
                    <button onClick={() => setStatus(r.id, 'approved')}
                      className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button onClick={() => setStatus(r.id, 'rejected')}
                      className="px-4 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">
                      Reject
                    </button>
                  )}
                  {r.status === 'approved' && (
                    <button
                      onClick={() => toggleFeatured(r)}
                      disabled={!r.featured && featuredCount >= MAX_FEATURED}
                      title={!r.featured && featuredCount >= MAX_FEATURED ? `Max ${MAX_FEATURED} featured reviews allowed` : undefined}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        r.featured
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : featuredCount >= MAX_FEATURED
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                      }`}>
                      {r.featured ? 'Unfeature' : 'Feature'}
                    </button>
                  )}
                  <button onClick={() => remove(r.id)}
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
