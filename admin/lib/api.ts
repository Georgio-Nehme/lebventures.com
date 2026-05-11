import { getToken } from './auth';

const BASE = process.env.NEXT_PUBLIC_API_URL!;

async function apiFetch(path: string, init?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Events
  getEvents:       (status?: string) => apiFetch(`/events${status ? `?status=${status}` : ''}`),
  getEvent:        (id: string)      => apiFetch(`/events/${id}`),
  createEvent:     (body: object)    => apiFetch('/events', { method: 'POST', body: JSON.stringify(body) }),
  updateEvent:     (id: string, body: object) => apiFetch(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEvent:     (id: string)      => apiFetch(`/events/${id}`, { method: 'DELETE' }),
  publishEvent:    (id: string)      => apiFetch(`/events/${id}/publish`,   { method: 'PATCH' }),
  unpublishEvent:  (id: string)      => apiFetch(`/events/${id}/unpublish`, { method: 'PATCH' }),

  // Upload
  getUploadUrl: (filename: string, contentType: string) =>
    apiFetch('/upload-url', { method: 'POST', body: JSON.stringify({ filename, contentType }) }),

  // Subscriptions
  getSubscriptions:    (eventId: string) => apiFetch(`/events/${eventId}/subscriptions`),
  deleteSubscription:  (id: string)      => apiFetch(`/subscriptions/${id}`, { method: 'DELETE' }),

  // Reviews
  getAllReviews:       (status?: string) => apiFetch(`/reviews${status ? `?status=${status}` : ''}`),
  getEventReviews:    (eventId: string) => apiFetch(`/events/${eventId}/reviews`),
  updateReviewStatus: (id: string, body: object) => apiFetch(`/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteReview:       (id: string)      => apiFetch(`/reviews/${id}`, { method: 'DELETE' }),
};
