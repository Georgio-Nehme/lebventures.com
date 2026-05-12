export interface Review {
  id: string;
  eventId: string;
  eventTitle?: string;
  authorName: string;
  rating: number;
  text: string;
  submittedAt: string;
  featured?: boolean;
}

export async function getFeaturedReviews(): Promise<Review[]> {
  const apiUrl = import.meta.env.PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/reviews/featured`);
    if (res.ok) return res.json();
  } catch {}
  return [];
}
