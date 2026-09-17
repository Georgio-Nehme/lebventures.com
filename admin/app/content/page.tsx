'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '@/lib/api';

type FieldType = 'text' | 'textarea' | 'image' | 'url' | 'toggle' | 'link';
type Field = { key: string; label: string; type: FieldType; default: string; value: string; updatedAt?: string };
type ContentPage = { id: string; label: string; fields: Field[] };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lebventures.com';

function humanize(segment: string): string {
  return segment.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function resolveImageSrc(value: string): string {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/.test(value)) return value;
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

const inputCls = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white';
const labelCls = 'block text-xs font-semibold text-slate-600 uppercase tracking-wide';

function AutoTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={3}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`${inputCls} resize-none overflow-hidden`}
    />
  );
}

export default function ContentPage() {
  const [pages, setPages]           = useState<ContentPage[]>([]);
  const [activeId, setActiveId]     = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [draft, setDraft]           = useState<Record<string, string>>({});
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [uploadPreview, setUploadPreview] = useState<Record<string, string>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    api.getContentSchema()
      .then((data: ContentPage[]) => {
        setPages(data);
        const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
        if (hash && data.some(p => p.id === hash)) setActiveId(hash);
        else if (data.length) setActiveId(data[0].id);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        setLoading(false);
      });
  }, []);

  const activePage = pages.find(p => p.id === activeId);

  const allFieldsByKey = useMemo(() => {
    const map: Record<string, Field> = {};
    for (const p of pages) for (const f of p.fields) map[f.key] = f;
    return map;
  }, [pages]);

  const groups = useMemo(() => {
    if (!activePage) return [];
    const order: string[] = [];
    const map = new Map<string, Field[]>();
    for (const f of activePage.fields) {
      const seg = f.key.split('.')[1] ?? '';
      if (!map.has(seg)) { map.set(seg, []); order.push(seg); }
      map.get(seg)!.push(f);
    }
    return order.map(seg => ({ title: humanize(seg), fields: map.get(seg)! }));
  }, [activePage]);

  const changedCount = Object.keys(draft).length;

  function fieldValue(f: Field): string {
    return draft[f.key] !== undefined ? draft[f.key] : f.value;
  }

  function setDraftValue(key: string, newValue: string) {
    setDraft(prev => {
      const field = allFieldsByKey[key];
      const next = { ...prev };
      if (field && newValue === field.value) delete next[key];
      else next[key] = newValue;
      return next;
    });
  }

  function selectTab(id: string) {
    if (id === activeId) return;
    if (changedCount > 0 && !confirm('You have unsaved changes. Discard them and switch pages?')) return;
    setDraft({});
    setSaveError('');
    setActiveId(id);
    if (typeof window !== 'undefined') window.location.hash = id;
  }

  function handleReset(f: Field) {
    setDraftValue(f.key, f.default);
  }

  function handleDiscard() {
    setDraft({});
    setSaveError('');
  }

  async function handleSave() {
    if (changedCount === 0) return;
    setSaving(true);
    setSaveError('');
    try {
      await api.updateContent(draft);
      const schema = await api.getContentSchema();
      setPages(schema);
      setDraft({});
      setSaveSuccess('Changes saved.');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File, key: string) {
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus(prev => ({ ...prev, [key]: 'Too large (max 5 MB)' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = e => setUploadPreview(prev => ({ ...prev, [key]: e.target?.result as string }));
    reader.readAsDataURL(file);

    setUploadStatus(prev => ({ ...prev, [key]: 'Uploading…' }));
    try {
      const ct = file.type || 'application/octet-stream';
      const { uploadUrl, publicUrl } = await api.getUploadUrl(file.name, ct, 'content');
      await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': ct }, body: file });
      setDraftValue(key, publicUrl);
      setUploadStatus(prev => ({ ...prev, [key]: '✓ Uploaded' }));
    } catch (err: unknown) {
      setUploadStatus(prev => ({ ...prev, [key]: `Failed: ${err instanceof Error ? err.message : err}` }));
    }
  }

  function renderField(f: Field) {
    const value = fieldValue(f);
    const isDefault = value === f.default;

    return (
      <div key={f.key} className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <label className={labelCls}>{f.label}</label>
          {!isDefault && (
            <button type="button" onClick={() => handleReset(f)}
              className="text-xs text-slate-400 hover:text-amber-600 underline decoration-dotted transition-colors">
              Reset to default
            </button>
          )}
        </div>

        {f.type === 'toggle' && (
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <span
              role="switch"
              aria-checked={value === 'true'}
              tabIndex={0}
              onClick={() => setDraftValue(f.key, value === 'true' ? 'false' : 'true')}
              onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setDraftValue(f.key, value === 'true' ? 'false' : 'true'); } }}
              className={`relative inline-block w-11 h-6 rounded-full transition-colors ${value === 'true' ? 'bg-amber-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value === 'true' ? 'translate-x-5' : ''}`} />
            </span>
            <span className="text-sm text-slate-700">{value === 'true' ? 'Visible' : 'Hidden'}</span>
          </label>
        )}

        {f.type === 'textarea' && (
          <AutoTextarea value={value} onChange={v => setDraftValue(f.key, v)} />
        )}

        {(f.type === 'text' || f.type === 'url' || f.type === 'link') && (
          <input
            type={f.type === 'url' ? 'url' : 'text'}
            value={value}
            onChange={e => setDraftValue(f.key, e.target.value)}
            placeholder={f.type === 'link' ? '/contact or https://…' : undefined}
            className={inputCls}
          />
        )}
        {f.type === 'link' && (
          <p className="text-xs text-slate-400">A site route like <code>/adventures</code> or a full URL like <code>https://example.com</code>.</p>
        )}

        {f.type === 'image' && (
          <div className="space-y-2">
            <div className="flex items-start gap-4 flex-wrap">
              <div
                onClick={() => fileInputs.current[f.key]?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) uploadImage(file, f.key); }}
                className="border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-xl w-48 h-32 flex items-center justify-center overflow-hidden cursor-pointer transition-colors shrink-0"
              >
                {(uploadPreview[f.key] || value) ? (
                  <img src={uploadPreview[f.key] || resolveImageSrc(value)} alt={f.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center px-2">
                    <svg className="w-6 h-6 mx-auto mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-400">Click or drag to upload</p>
                  </div>
                )}
              </div>
              <input
                ref={el => { fileInputs.current[f.key] = el; }}
                type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0], f.key); }}
              />
              <div className="flex-1 min-w-[200px] space-y-1.5">
                <input
                  type="text"
                  value={value}
                  onChange={e => setDraftValue(f.key, e.target.value)}
                  placeholder="/images/example.jpg or https://…"
                  className={inputCls}
                />
                {uploadStatus[f.key] && (
                  <p className={`text-xs ${uploadStatus[f.key].startsWith('✓') ? 'text-green-600' : uploadStatus[f.key] === 'Uploading…' ? 'text-slate-400' : 'text-red-500'}`}>
                    {uploadStatus[f.key]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 pb-0 flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Website Content</h1>
            <p className="text-slate-500 text-sm mt-0.5">Edit the text and images shown on the public site.</p>
          </div>
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline">
            View site ↗
          </a>
        </div>

        {loading ? (
          <div className="text-slate-400 text-center py-16">Loading…</div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        ) : (
          <>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit flex-wrap">
              {pages.map(p => (
                <button key={p.id} onClick={() => selectTab(p.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeId === p.id ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>

            {saveSuccess && (
              <div className="mb-6 bg-green-50 text-green-700 rounded-xl p-4 text-sm">{saveSuccess}</div>
            )}

            <div className="flex flex-col gap-6 pb-28">
              {groups.map(group => (
                <div key={group.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                  <h2 className="font-bold text-slate-800">{group.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {group.fields.map(f => (
                      <div key={f.key} className={f.type === 'textarea' || f.type === 'image' ? 'md:col-span-2' : ''}>
                        {renderField(f)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {changedCount > 0 && (
        <div className="sticky bottom-0 inset-x-0 -mx-8 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-8 py-4 flex items-center justify-between flex-wrap gap-3 z-10">
          <span className="text-sm font-medium text-slate-600">
            {changedCount} unsaved change{changedCount === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-3">
            {saveError && <span className="text-sm text-red-600">{saveError}</span>}
            <button type="button" onClick={handleDiscard} disabled={saving}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-50 transition-colors">
              Discard
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center gap-2">
              {saving && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" /></svg>}
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
