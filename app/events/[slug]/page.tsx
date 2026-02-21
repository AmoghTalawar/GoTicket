'use client'

import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { registerForEvent, getAuthToken } from '../../../lib/api'

const eventsData: Record<string, any> = {
  'gen-ai-summit': {
    id: 'gen-ai-summit',
    title: 'Generative AI Summit India',
    category: 'Tech',
    date: 'Nov 15-16',
    location: 'BIEC, Bengaluru',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
    description: 'Join the leading minds in Generative AI for a two-day summit in Bengaluru. Explore the latest breakthroughs in LLMs, image generation, and ethical AI. Network with industry leaders and participate in hands-on workshops designed to elevate your understanding of the AI landscape.',
    agenda: [
      { time: '09:00 AM', activity: 'Registration & Breakfast' },
      { time: '10:00 AM', activity: 'Keynote: The Future of GenAI in India' },
      { time: '11:30 AM', activity: 'Panel: AI in Enterprise Solutions' },
      { time: '02:00 PM', activity: 'Workshops: Building with LLMs' },
    ],
    speakers: ['Dr. Aditi Sharma', 'Rajesh Kumar', 'Sarah Jenkins']
  },
  'fintech-india': {
    id: 'fintech-india',
    title: 'Future of Fintech India 2024',
    category: 'Business',
    date: 'Dec 02',
    location: 'Bharat Mandapam, New Delhi',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop',
    description: 'Discover the future of financial technology at India\'s premier fintech conference. Topics include blockchain, digital payments, regulatory landscapes, and financial inclusion strategies driving the next wave of growth.',
    agenda: [
      { time: '09:30 AM', activity: 'Opening Ceremony' },
      { time: '10:30 AM', activity: 'UPI & Beyond: Global Expansion' },
      { time: '01:00 PM', activity: 'Networking Lunch' },
      { time: '03:00 PM', activity: 'Startup Pitch Session' },
    ],
    speakers: ['Amitabh Kant', 'Nandan Nilekani (Invited)', 'Kunal Shah']
  },
  'ux-symposium': {
    id: 'ux-symposium',
    title: 'Indian UX Design Symposium',
    category: 'Design',
    date: 'Dec 12',
    location: 'T-Hub, Hyderabad',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=2070&auto=format&fit=crop',
    description: 'A gathering of design thinkers and UX practitioners. Dive deep into user research, design systems, and accessibility in the Indian context. Learn how to build products that resonate with a diverse user base.',
    agenda: [
      { time: '10:00 AM', activity: 'Design Systems at Scale' },
      { time: '12:00 PM', activity: 'Accessibility Workshop' },
      { time: '04:00 PM', activity: 'Portfolio Reviews' },
    ],
    speakers: ['Sneha Rao', 'Mike Chen', 'Anjali Sud']
  },
  'ai-ethics': {
    id: 'ai-ethics',
    title: 'Ethical AI & Data Privacy Panel',
    category: 'Tech',
    date: 'Jan 05',
    location: 'Jio World Centre, Mumbai',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    description: 'An essential discussion on the ethical implications of AI deployment and data privacy regulations in India. Understand the balance between innovation and responsibility.',
    agenda: [
      { time: '05:00 PM', activity: 'Welcome Note' },
      { time: '05:30 PM', activity: 'Panel Discussion' },
      { time: '07:00 PM', activity: 'Q&A Session' },
    ],
    speakers: ['Justice B.N. Srikrishna (Retd.)', 'Tech Policy Experts']
  },
  'green-energy': {
    id: 'green-energy',
    title: 'Green Energy Expo 2025',
    category: 'Environment',
    date: 'Jan 20',
    location: 'Chennai Trade Centre, Chennai',
    price: 999,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
    description: 'Explore the latest in renewable energy technologies, from solar and wind to green hydrogen and EV infrastructure. Meet the innovators powering a sustainable future.',
    agenda: [
      { time: '09:00 AM', activity: 'Expo Floor Opens' },
      { time: '11:00 AM', activity: 'Seminar: Solar Policy' },
      { time: '03:00 PM', activity: 'EV Showcase' },
    ],
    speakers: ['Minister of New & Renewable Energy', 'Industry CEOs']
  },
  'startup-networking': {
    id: 'startup-networking',
    title: 'Startup Founders Networking',
    category: 'Business',
    date: 'Feb 10',
    location: 'Cyber City, Gurugram',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
    description: 'Connect with fellow founders, investors, and mentors in an informal setting. Share stories, find co-founders, and grow your network in the heart of India\'s startup ecosystem.',
    agenda: [
      { time: '06:00 PM', activity: 'Ice Breaker Session' },
      { time: '07:00 PM', activity: 'Speed Networking' },
      { time: '08:30 PM', activity: 'Dinner & Drinks' },
    ],
    speakers: ['Successful Unicorn Founders']
  }
};

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const event = eventsData[slug];
  const router = useRouter();
  const [showBooking, setShowBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });

  if (!event) {
    notFound();
  }

  // Check login state on mount
  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  const totalPrice = event.price * ticketCount;

  const handleBookNowClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
    } else {
      setShowBooking(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setIsSubmitting(true);

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      setBookingError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setBookingError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    const phoneClean = formData.phone.replace(/[\s\-\(\)\+]/g, '');
    if (phoneClean.length < 10) {
      setBookingError('Please enter a valid phone number.');
      setIsSubmitting(false);
      return;
    }

    try {
      const bookingNotes = [
        `Name: ${formData.fullName}`,
        `Email: ${formData.email}`,
        `Phone: ${formData.phone}`,
        `Tickets: ${ticketCount}`,
        `Total: ${formatINR(totalPrice)}`,
        formData.notes ? `Notes: ${formData.notes}` : '',
      ].filter(Boolean).join(' | ');

      await registerForEvent({
        event_id: event.id,
        notes: bookingNotes,
      });

      setBookingSuccess(true);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized') || err.message?.includes('token')) {
        setBookingError('Please log in first to book this event.');
      } else if (err.message?.includes('already registered')) {
        setBookingError('You are already registered for this event.');
      } else if (err.message?.includes('full') || err.message?.includes('capacity')) {
        setBookingError('Sorry, this event is fully booked.');
      } else {
        setBookingError(err.message || 'Booking failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="flex items-center justify-center size-8 bg-primary rounded text-white">
                <span className="material-symbols-outlined text-xl">confirmation_number</span>
              </div>
              <span className="text-xl font-bold tracking-tight">GoTicket</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">Home</Link>
              <Link href="/events" className="text-sm font-medium text-primary">Events</Link>
              <Link href="/my-registrations" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">My Tickets</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/events" className="text-sm text-slate-300 hover:text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="relative h-[50vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${event.image}')` }}></div>
          <div className="relative z-20 h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded mb-4 w-fit uppercase tracking-wider">{event.category}</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">calendar_today</span>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">location_on</span>
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-white">About the Event</h2>
                <p className="text-slate-400 leading-relaxed text-lg">{event.description}</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 text-white">Agenda</h2>
                <div className="space-y-4">
                  {event.agenda.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 bg-surface-dark border border-border-dark rounded-lg hover:border-primary/30 transition-colors">
                      <span className="font-bold text-primary min-w-[100px]">{item.time}</span>
                      <span className="text-slate-300">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 text-white">Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-surface-dark border border-border-dark rounded-lg">
                      <div className="size-12 bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400">person</span>
                      </div>
                      <span className="font-medium text-white">{speaker}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar — Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-surface-dark border border-border-dark rounded-xl p-6 space-y-6 shadow-xl">

                {/* Success State */}
                {bookingSuccess ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                      <span className="material-symbols-outlined text-green-400 !text-[36px]">check_circle</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Booking Confirmed!</h3>
                    <p className="text-slate-400 text-sm">
                      Your registration for <strong className="text-white">{event.title}</strong> has been confirmed.
                      Check your email for details.
                    </p>
                    <div className="bg-background-dark rounded-lg p-4 text-left space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Event</span>
                        <span className="text-white font-medium">{event.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tickets</span>
                        <span className="text-white font-medium">{ticketCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total</span>
                        <span className="text-primary font-bold">{formatINR(totalPrice)}</span>
                      </div>
                    </div>
                    <Link href="/my-registrations" className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all text-center">
                      View My Registrations
                    </Link>
                  </div>
                ) : showLoginPrompt && !isLoggedIn ? (
                  /* Login Required Prompt */
                  <div className="text-center space-y-5 py-4">
                    <div className="size-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto">
                      <span className="material-symbols-outlined text-amber-400 !text-[28px]">lock</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Login Required</h3>
                    <p className="text-slate-400 text-sm">
                      Please sign in to your account to book tickets for <strong className="text-white">{event.title}</strong>.
                    </p>
                    <Link
                      href="/login"
                      className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all text-center"
                    >
                      Sign In to Continue
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full border border-border-dark hover:border-primary/50 text-slate-300 font-medium py-3 rounded-lg transition-all text-center"
                    >
                      Create an Account
                    </Link>
                    <button
                      onClick={() => setShowLoginPrompt(false)}
                      className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                      ← Back to event details
                    </button>
                  </div>
                ) : !showBooking ? (
                  <>
                    {/* Price Display */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Ticket Price</span>
                      <span className="text-3xl font-bold text-white">{formatINR(event.price)}</span>
                    </div>

                    <button
                      onClick={handleBookNowClick}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98]"
                    >
                      <span>Book Now</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>

                    <div className="pt-6 border-t border-border-dark space-y-4">
                      <h3 className="font-bold text-white">Event Details</h3>
                      <div className="space-y-3 text-sm text-slate-400">
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span className="text-white">{event.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time</span>
                          <span className="text-white">09:00 AM - 06:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Venue</span>
                          <span className="text-white text-right max-w-[60%]">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Booking Form */
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">Book Your Spot</h3>
                      <button
                        type="button"
                        onClick={() => { setShowBooking(false); setBookingError(''); }}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">close</span>
                      </button>
                    </div>

                    {bookingError && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                        <span className="material-symbols-outlined text-base mt-0.5">error</span>
                        {bookingError}
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-background-dark border border-border-dark text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-background-dark border border-border-dark text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-500"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Phone Number <span className="text-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-background-dark border border-border-dark text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    {/* Number of Tickets */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Number of Tickets
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          className="size-10 flex items-center justify-center rounded-lg bg-background-dark border border-border-dark text-slate-400 hover:text-white hover:border-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">remove</span>
                        </button>
                        <span className="text-xl font-bold text-white min-w-[40px] text-center font-mono">{ticketCount}</span>
                        <button
                          type="button"
                          onClick={() => setTicketCount(Math.min(5, ticketCount + 1))}
                          className="size-10 flex items-center justify-center rounded-lg bg-background-dark border border-border-dark text-slate-400 hover:text-white hover:border-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">add</span>
                        </button>
                      </div>
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Special Requirements <span className="text-slate-500">(optional)</span>
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-background-dark border border-border-dark text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-slate-500"
                        placeholder="Dietary requirements, accessibility needs, etc."
                      />
                    </div>

                    {/* Price Summary */}
                    <div className="bg-background-dark rounded-lg p-4 space-y-2 border border-border-dark">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{formatINR(event.price)} × {ticketCount} ticket{ticketCount > 1 ? 's' : ''}</span>
                        <span className="text-white">{formatINR(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Platform fee</span>
                        <span className="text-green-400">Free</span>
                      </div>
                      <div className="border-t border-border-dark pt-2 flex justify-between font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-primary text-lg">{formatINR(totalPrice)}</span>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">how_to_reg</span>
                          <span>Confirm Booking — {formatINR(totalPrice)}</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-xs">lock</span>
                      Secured by GoTicket Guarantee
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface-dark border-t border-border-dark py-12 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <div className="flex items-center justify-center size-6 bg-primary rounded text-white">
                <span className="material-symbols-outlined text-sm">confirmation_number</span>
              </div>
              <span className="text-lg font-bold tracking-tight">GoTicket</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="border-t border-border-dark mt-8 pt-8 text-center text-xs text-slate-500">
            <p>© 2026 GoTicket Platform. Editorial Urgency.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}