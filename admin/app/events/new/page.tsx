import EventForm from '@/components/EventForm';

export default function NewEventPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Event</h1>
      <EventForm mode="create" />
    </div>
  );
}
