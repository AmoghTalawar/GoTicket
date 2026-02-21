'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import { useState, useEffect } from 'react'
import { fetchEvents, formatINR } from '../../lib/api'
import type { Event } from '../../lib/api'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch events:', err)
        setLoading(false)
      })
  }, [])

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col antialiased">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="border-b border-border-dark bg-surface-dark">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Explore Events</h1>
                <p className="text-slate-400">Discover and register for upcoming events across India.</p>
              </div>
              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full h-11 bg-background-dark border border-border-dark text-white rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                <p className="text-slate-400 mt-4">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-slate-500">event_busy</span>
                <h3 className="text-xl font-bold text-white mt-4">No Events Found</h3>
                <p className="text-slate-400 mt-2">
                  {searchQuery ? 'Try a different search term.' : 'No events are currently available. Check back later!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => {
                  const eventDate = new Date(event.event_date)
                  const dateStr = eventDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="group relative bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                    >
                      {/* Image */}
                      <div className="aspect-video w-full overflow-hidden">
                        {event.image_url ? (
                          <div
                            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                            style={{ backgroundImage: `url('${event.image_url}')` }}
                          ></div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-slate-800 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-slate-500">event</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          {event.category && (
                            <span className="text-xs font-bold text-primary uppercase">{event.category}</span>
                          )}
                          <span className="text-sm text-slate-400">{dateStr}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        {event.location && (
                          <p className="text-sm text-slate-500 mb-4">{event.location}</p>
                        )}
                        <div className="flex justify-between items-center border-t border-border-dark pt-4">
                          <span className="text-white font-medium">{formatINR(event.price)}</span>
                          <span className="text-sm text-white font-medium group-hover:text-primary transition-colors flex items-center gap-1">
                            Register
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-dark border-t border-border-dark py-8 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <div className="flex items-center justify-center size-6 bg-primary rounded text-white">
                <span className="material-symbols-outlined text-sm">confirmation_number</span>
              </div>
              <span className="text-lg font-bold">GoTicket</span>
            </div>
            <p className="text-xs text-slate-500">© 2026 GoTicket Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
