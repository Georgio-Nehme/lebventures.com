'use client';
import { use } from 'react';
import EventForm from '@/components/EventForm';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Event</h1>
      <EventForm mode="edit" eventId={id} />
    </div>
  );
}
