'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type Mode = 'create' | 'edit';
interface Props { mode: Mode; eventId?: string; }

const EVENT_TYPES = ['hiking','climbing','camping','heritage','canyoning','biking','workshop','water','snow','leisure','kids'];
const DIFFICULTIES = ['Easy','Moderate','Challenging','Expert'];

export default function EventForm({ mode, eventId }: Props) {
  const router   = useRouter();
  const isEdit   = mode === 'edit';
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState<'draft' | 'published'>('draft');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [trailUrl, setTrailUrl] = useState('');
  const [imgStatus, setImgStatus] = useState('');
  const [trailStatus, setTrailStatus] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const formRef    = useRef<HTMLFormElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const trailInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit || !eventId) return;
    api.getEvent(eventId).then((ev: Record<string,unknown>) => {
      if (!formRef.current) return;
      const f = formRef.current;
      const set = (name: string, val: unknown) => {
        const el = f.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        if (el && val != null) el.value = String(val);
      };
      set('title', ev.title); set('type', ev.type); set('date', ev.date);
      set('time', ev.time); set('duration', ev.duration); set('guide', ev.guide);
      set('location', ev.location); set('region', ev.region);
      const coords = ev.coords as { lat?: number; lng?: number } | undefined;
      set('lat', coords?.lat); set('lng', coords?.lng);
      set('spots', ev.spots); set('spotsLeft', ev.spotsLeft); set('price', ev.price);
      set('difficulty', ev.difficulty); set('description', ev.description);
      set('highlights', Array.isArray(ev.highlights) ? (ev.highlights as string[]).join('\n') : ev.highlights);
      if (ev.status) setStatus(ev.status as 'draft' | 'published');
      if (ev.image)  { setImageUrl(ev.image as string); setImgPreview(ev.image as string); }
      if (ev.trailFile) setTrailUrl(ev.trailFile as string);
    }).catch(() => setError('Failed to load event'));
  }, [isEdit, eventId]);

  async function uploadFile(file: File): Promise<string> {
    let ct = file.type || 'application/octet-stream';
    if (file.name.endsWith('.gpx')) ct = 'application/gpx+xml';
    if (file.name.endsWith('.kml')) ct = 'application/vnd.google-earth.kml+xml';
    const { uploadUrl, publicUrl } = await api.getUploadUrl(file.name, ct);
    await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': ct }, body: file });
    return publicUrl;
  }

  async function handleImage(file: File) {
    if (file.size > 5 * 1024 * 1024) { setImgStatus('Too large (max 5 MB)'); return; }
    const reader = new FileReader();
    reader.onload = e => setImgPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setImgStatus('Uploading…');
    try { const url = await uploadFile(file); setImageUrl(url); setImgStatus('✓ Uploaded'); }
    catch (e: unknown) { setImgStatus(`Failed: ${e instanceof Error ? e.message : e}`); }
  }

  async function handleTrail(file: File) {
    setTrailStatus('Uploading…');
    try { const url = await uploadFile(file); setTrailUrl(url); setTrailStatus(`✓ ${file.name}`); }
    catch (e: unknown) { setTrailStatus(`Failed: ${e instanceof Error ? e.message : e}`); }
  }

  async function handleSubmit(e: React.FormEvent, saveAs?: 'draft' | 'published') {
    e.preventDefault();
    if (!formRef.current) return;
    setError(''); setSuccess(''); setLoading(true);
    const fd  = new FormData(formRef.current);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const data = {
      title: raw.title, type: raw.type, date: raw.date,
      time: raw.time || undefined, duration: raw.duration || undefined,
      guide: raw.guide, location: raw.location, region: raw.region || undefined,
      difficulty: raw.difficulty, description: raw.description,
      highlights: raw.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean),
      spots: Number(raw.spots), spotsLeft: Number(raw.spotsLeft), price: Number(raw.price),
      coords: (raw.lat && raw.lng) ? { lat: Number(raw.lat), lng: Number(raw.lng) } : undefined,
      status: saveAs ?? status,
      image: imageUrl || undefined,
      trailFile: trailUrl || undefined,
    };
    try {
      if (isEdit && eventId) {
        await api.updateEvent(eventId, data);
        setSuccess('Event saved.');
      } else {
        const created = await api.createEvent(data) as { id: string };
        setSuccess(`Event ${data.status === 'published' ? 'published' : 'saved as draft'}.`);
        setTimeout(() => router.push(`/events/${created.id}/edit`), 1200);
      }
      setStatus(data.status as 'draft' | 'published');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white';
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {error   && <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 rounded-xl p-4 text-sm">{success}</div>}

      {/* Status badge */}
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
          status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {status === 'published' ? '● Published' : '○ Draft'}
        </span>
        <span className="text-slate-400 text-xs">You can save as draft and publish later.</span>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-slate-800">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelCls}>Title *</label>
            <input name="title" required className={inputCls} placeholder="Qadisha Valley Hike" />
          </div>
          <div>
            <label className={labelCls}>Type *</label>
            <select name="type" required className={inputCls}>
              <option value="">Select…</option>
              {EVENT_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Difficulty *</label>
            <select name="difficulty" required className={inputCls}>
              <option value="">Select…</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Date *</label>
            <input name="date" type="date" required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Start Time</label>
            <input name="time" type="time" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <input name="duration" className={inputCls} placeholder="Full day (8 hrs)" />
          </div>
          <div>
            <label className={labelCls}>Guide</label>
            <input name="guide" className={inputCls} placeholder="Pierre & Gioia" />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-slate-800">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Location Name *</label>
            <input name="location" required className={inputCls} placeholder="Qadisha Valley" />
          </div>
          <div>
            <label className={labelCls}>Region</label>
            <input name="region" className={inputCls} placeholder="North Lebanon" />
          </div>
          <div>
            <label className={labelCls}>Latitude</label>
            <input name="lat" type="number" step="any" className={inputCls} placeholder="34.215" />
          </div>
          <div>
            <label className={labelCls}>Longitude</label>
            <input name="lng" type="number" step="any" className={inputCls} placeholder="36.020" />
          </div>
        </div>
      </div>

      {/* Capacity & pricing */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-slate-800">Capacity & Pricing</h2>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className={labelCls}>Total Spots *</label>
            <input name="spots" type="number" min="1" required className={inputCls} placeholder="12" />
          </div>
          <div>
            <label className={labelCls}>Spots Left *</label>
            <input name="spotsLeft" type="number" min="0" required className={inputCls} placeholder="12" />
          </div>
          <div>
            <label className={labelCls}>Price (USD) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
              <input name="price" type="number" min="0" step="0.01" required className={`${inputCls} pl-7`} placeholder="0 = Free" />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-slate-800">Description & Highlights</h2>
        <div>
          <label className={labelCls}>Description *</label>
          <textarea name="description" rows={4} required className={`${inputCls} resize-none`} placeholder="Describe the experience…" />
        </div>
        <div>
          <label className={labelCls}>Highlights <span className="font-normal text-slate-400 normal-case">(one per line)</span></label>
          <textarea name="highlights" rows={5} className={`${inputCls} resize-none font-mono text-xs`}
            placeholder={"Stargazing session\nFire workshop\nWildlife tracking"} />
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-5">Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cover image */}
          <div>
            <label className={labelCls}>Cover Photo</label>
            <div onClick={() => imageInput.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImage(f); }}
              className="mt-1 border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-xl p-6 text-center cursor-pointer transition-colors">
              {imgPreview
                ? <img src={imgPreview} className="w-full h-36 object-cover rounded-lg" alt="Preview" />
                : <div>
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p className="text-sm text-gray-400">Click or drag to upload</p>
                    <p className="text-xs text-gray-300 mt-1">JPEG, PNG, WebP · max 5 MB</p>
                  </div>
              }
            </div>
            <input ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleImage(e.target.files[0]); }} />
            {imgStatus && <p className={`text-xs mt-1.5 ${imgStatus.startsWith('✓') ? 'text-green-600' : imgStatus === 'Uploading…' ? 'text-slate-400' : 'text-red-500'}`}>{imgStatus}</p>}
          </div>
          {/* Trail file */}
          <div>
            <label className={labelCls}>Trail File <span className="font-normal text-slate-400 normal-case">(GPX/KML)</span></label>
            <div onClick={() => trailInput.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleTrail(f); }}
              className="mt-1 border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-xl p-6 text-center cursor-pointer transition-colors">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <p className="text-sm text-gray-400">{trailUrl ? trailUrl.split('/').pop() : 'Click or drag to upload'}</p>
            </div>
            <input ref={trailInput} type="file" accept=".gpx,.kml" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleTrail(e.target.files[0]); }} />
            {trailStatus && <p className={`text-xs mt-1.5 ${trailStatus.startsWith('✓') ? 'text-green-600' : trailStatus === 'Uploading…' ? 'text-slate-400' : 'text-red-500'}`}>{trailStatus}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pb-4">
        <button type="button" onClick={() => router.push('/dashboard')}
          className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
          ← Back
        </button>
        <div className="flex gap-3">
          <button type="button" disabled={loading} onClick={e => handleSubmit(e as unknown as React.FormEvent, 'draft')}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Save as Draft
          </button>
          <button type="button" disabled={loading} onClick={e => handleSubmit(e as unknown as React.FormEvent, 'published')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center gap-2">
            {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round"/></svg>}
            {isEdit ? 'Save & Publish' : 'Publish'}
          </button>
        </div>
      </div>
    </form>
  );
}
