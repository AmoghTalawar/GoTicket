'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEvent, getAuthToken } from '../../../lib/api'

export default function CreateEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: '',
    capacity: '150',
    imageUrl: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!formData.title) {
      setError('Event title is required.')
      setIsSubmitting(false)
      return
    }
    if (!formData.date) {
      setError('Event date is required.')
      setIsSubmitting(false)
      return
    }

    try {
      const eventDate = formData.time
        ? `${formData.date}T${formData.time}:00+05:30`
        : `${formData.date}T09:00:00+05:30`

      await createEvent({
        title: formData.title,
        description: formData.description,
        event_date: eventDate,
        location: formData.location,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : 0,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        image_url: formData.imageUrl,
      })

      setSuccess(true)
      setTimeout(() => router.push('/events'), 2000)
    } catch (err: any) {
      if (err.message?.includes('Unauthorized') || err.message?.includes('token')) {
        setError('Please log in first to create an event.')
      } else {
        setError(err.message || 'Failed to create event. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e3e7] dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 z-20 relative">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">GoTicket</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <div className="hidden md:flex items-center gap-9">
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors text-sm font-medium leading-normal" href="/">Home</a>
            <a className="text-primary text-sm font-medium leading-normal" href="/events">Events</a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors text-sm font-medium leading-normal" href="/my-registrations">My Tickets</a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar: Stepper */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-[#e0e3e7] dark:border-slate-800 flex-shrink-0 hidden lg:flex flex-col py-8 px-6">
          <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-slate-900 dark:text-white text-xl font-bold">Create Event</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{formData.title || 'New Event'}</p>
          </div>
          <nav className="flex flex-col gap-6 relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md ring-4 ring-white dark:ring-slate-900">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Event Details</span>
                <span className="text-xs text-primary font-mono mt-1">In Progress</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* Center: Form Area */}
        <main className="flex-1 overflow-y-auto bg-cream dark:bg-[#1e2329] p-6 lg:p-12 scroll-smooth">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-900/10 dark:border-white/10 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create New Event</h2>
                <p className="text-slate-600 dark:text-slate-400">Fill in the details to publish your event.</p>
              </div>
            </div>

            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                Event created successfully! Redirecting...
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-8">
              {/* Event Title */}
              <div className="space-y-3">
                <label className="block text-base font-bold text-slate-900 dark:text-white">Event Title <span className="text-primary">*</span></label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. GenAI Summit India 2026"
                  type="text"
                />
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="block text-base font-bold text-slate-900 dark:text-white">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-900 dark:text-white focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select category</option>
                  <option value="Tech">Tech</option>
                  <option value="Business">Business</option>
                  <option value="Design">Design</option>
                  <option value="Environment">Environment</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-base font-bold text-slate-900 dark:text-white">Date <span className="text-primary">*</span></label>
                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-900 dark:text-white focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    type="date"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-base font-bold text-slate-900 dark:text-white">Time</label>
                  <input
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-900 dark:text-white focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    type="time"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="block text-base font-bold text-slate-900 dark:text-white">Location</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-primary material-symbols-outlined">location_on</span>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. BIEC, Bengaluru"
                    type="text"
                  />
                </div>
              </div>

              {/* Price & Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-base font-bold text-slate-900 dark:text-white">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-primary font-bold">₹</span>
                    <input
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="0 for free events"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-base font-bold text-slate-900 dark:text-white">Total Seats</label>
                  <input
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="150"
                    type="number"
                    min="1"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="block text-base font-bold text-slate-900 dark:text-white">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Describe the event..."
                  rows={6}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-3">
                <label className="block text-base font-bold text-slate-900 dark:text-white">Image URL</label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="https://example.com/event-image.jpg"
                  type="url"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-8 pb-12 border-t border-slate-900/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => router.push('/events')}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    Creating...
                  </>
                ) : (
                  <>
                    Publish Event
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
