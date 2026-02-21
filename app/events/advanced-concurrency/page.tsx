'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function EventDetailsPage() {
  const [selectedTicket, setSelectedTicket] = useState('professional')

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col relative">
      {/* Navbar */}
      <div className="relative w-full z-50">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#382a29] bg-[#171211] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-white">
              <div className="size-6 text-primary">
                <span className="material-symbols-outlined !text-[28px]">confirmation_number</span>
              </div>
              <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] font-display">GoTicket</h2>
            </div>
            <div className="hidden md:flex items-center gap-9">
              <a className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="/">Home</a>
              <a className="text-primary text-sm font-medium leading-normal" href="/events">Events</a>
              <a className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="/my-registrations">My Tickets</a>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-6">
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded h-full bg-[#382a29]">
                <div className="text-[#b7a09e] flex border-none items-center justify-center pl-4 rounded-l border-r-0">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-[#b7a09e] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal font-display" placeholder="Find event..." />
              </div>
            </label>
            <button className="flex items-center justify-center overflow-hidden rounded size-10 bg-[#382a29] hover:bg-[#4a3a39] text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[#382a29]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACktmhtgICuqEB7l4jqQBWF98fby1PZ6toLrDn6cLkSnWBj20Xj9BmG_60MVpd44L-M4pWqbHe9dB4CK0wTuJAGMJn7RzJf3CGZdqRlcziMj2KWm1KPswei9hwLpi3rIUCQt5YNfmOo0aKEau9DZ1C03tPEZjgFqWIT-DxdenwlKayvgobWN3o15-czntT2fcIA5qaWdOs_Ha-o6RRd8gKjLEiX86CBhdnA0VsIlORryrxKoeq8dF5BIZ3BxYyZVQsh_BcYN6JZrA0")' }}></div>
          </div>
        </header>
      </div>

      {/* Main Content Grid */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* Left Content */}
        <div className="lg:col-span-8 border-r border-[#382a29] flex flex-col relative z-10">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 px-8 pt-8 pb-4">
            <a className="text-[#b7a09e] hover:text-white text-sm font-medium font-mono" href="/">HOME</a>
            <span className="text-[#b7a09e] text-sm font-medium font-mono">/</span>
            <a className="text-[#b7a09e] hover:text-white text-sm font-medium font-mono" href="/events">EVENTS</a>
            <span className="text-[#b7a09e] text-sm font-medium font-mono">/</span>
            <span className="text-primary text-sm font-medium font-mono">CONCURRENCY</span>
          </div>

          {/* Hero Image & Title */}
          <div className="px-8 pb-8">
            <div className="relative w-full aspect-[21/9] overflow-hidden rounded-lg mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7KAi953iXnSboDPirQKJIZZiArIqURDIu_C5TqppXZz2FI9A7d4li9sU5e1x8E8RvFQmzfOfAf6xhpYyNBoJ4T7IPNjI281QznNOJZNQCdhn7w8w1zdWy3b5Yk9dR23uITPHXX2sxOQKmuVzzv5w0r7b1Y0rDS9TAJqspalpRtQ_qrxT4PuCRsvwzdIk7jd5swnjX_8j-yl300yvNthQ0PMH47adkVSA17yTVZTgsAN3P-Y-7vFjR6fj2a25Af_r-VpE1ITzB5hZJ")' }}
              >
              </div>
              <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md border border-[#382a29] text-white px-3 py-1 rounded text-xs font-mono uppercase tracking-wider">
                <span className="text-primary">●</span> Live Event
              </div>
            </div>
            <div className="relative z-20 -mt-16">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-white leading-[0.9] tracking-tighter mb-4 drop-shadow-xl">
                Advanced <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#b7a09e]">Concurrency</span> in Go
              </h1>
              <p className="text-[#b7a09e] text-xl font-display font-light max-w-2xl mt-6">
                Mastering Channels, Goroutines, and high-performance system architecture. A deep dive for senior engineers.
              </p>
              <div className="flex flex-wrap gap-6 mt-6 items-center">
                <div className="flex items-center gap-2 text-[#b7a09e] font-mono text-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                  <span>2023-10-24T18:00:00Z</span>
                </div>
                <div className="flex items-center gap-2 text-[#b7a09e] font-mono text-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                  <span>San Francisco • Online</span>
                </div>
                <div className="flex items-center gap-2 text-[#b7a09e] font-mono text-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                  <span>4h 30m Duration</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="px-8 py-8 border-t border-[#382a29]">
            <h3 className="text-white text-2xl font-bold font-display mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary block rounded-sm"></span>
              Event Brief
            </h3>
            <div className="prose prose-invert prose-lg text-[#b7a09e] font-light max-w-none">
              <p>
                Golang's concurrency model is its superpower, but mastering it requires going beyond the basics. This intensive workshop dissects the Go scheduler, memory model, and synchronization primitives.
              </p>
              <p className="mt-4">
                We will construct a high-throughput data pipeline from scratch, identifying bottlenecks and race conditions in real-time. Expect a hands-on, code-heavy session designed for production-grade engineering.
              </p>
            </div>
          </div>

          {/* Schedule */}
          <div className="px-8 py-8 border-t border-[#382a29] mb-20">
            <h3 className="text-white text-2xl font-bold font-display mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary block rounded-sm"></span>
              Agenda Timeline
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { time: '10:00', ampm: 'AM PST', title: 'The Scheduler Internals', desc: 'Understanding M:N scheduling, context switching, and preemption.', speaker: 'Rob P.' },
                { time: '11:30', ampm: 'AM PST', title: 'Patterns for Fan-out/Fan-in', desc: 'Building resilient worker pools and error handling in concurrent streams.', speaker: 'Sarah J.' },
                { time: '01:00', ampm: 'PM PST', title: 'Deadlock Detection & Analysis', desc: 'Using pprof and trace tools to visualize contention.', speaker: 'Ken T.' },
              ].map((item, idx) => (
                <div key={idx} className="group flex flex-col md:flex-row gap-4 p-4 bg-surface-dark/50 hover:bg-surface-dark border border-[#382a29] rounded transition-all">
                  <div className="min-w-[120px] flex flex-row md:flex-col items-center md:items-start gap-2 border-b md:border-b-0 md:border-r border-[#382a29] pb-2 md:pb-0 md:pr-4">
                    <span className="text-primary font-mono font-bold text-lg">{item.time}</span>
                    <span className="text-[#b7a09e] font-mono text-xs">{item.ampm}</span>
                  </div>
                  <div className="flex-1 pl-2 border-l-2 border-primary">
                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                    <p className="text-[#b7a09e] text-sm mt-1">{item.desc}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAn0zvHSl8cfi859cHNdU0Md-xtPVRjQBe5gRbFXZPt7o3tsdx4-6S753y_jSS2AN-QGpH0F__c7vWJpgm4zsZS3c1mSBC_oXVSVIcbCYodwcaieNvfYhsJtl6P-5T8Z401s_dg7zlfm-PAnnv_TqN9PKrezFLv0nWMaoiDp_IXtBF0_SroZ3V7XkWZagsigbpattEpdmRmqfD8OD1NJLfo4whwPUGbBMdpM0sRnqjvzYOm2WBAaHQP9u_aE1qZkzDGh8oDSGm43r5B")' }}></div>
                      <span className="text-xs text-white font-mono">{item.speaker}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Sticky Registration) */}
        <div className="lg:col-span-4 relative z-20">
          <div className="sticky top-0 h-screen overflow-y-auto bg-[#1a1413] border-l border-[#382a29] flex flex-col">
            {/* Status Banner */}
            <div className="bg-amber-badge/10 border-b border-amber-badge/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-badge text-[20px]">hourglass_top</span>
                <span className="text-amber-badge font-mono text-sm font-bold uppercase tracking-wider">Waitlist Active</span>
              </div>
              <span className="bg-amber-badge text-[#171211] text-xs font-bold px-2 py-0.5 rounded-sm">
                POS #42
              </span>
            </div>

            <div className="p-6 md:p-8 flex flex-col flex-1">
              <h2 className="font-serif italic text-3xl text-white mb-2">Registration</h2>
              <p className="text-[#b7a09e] text-sm mb-6">Secure your virtual seat for the live stream and recording access.</p>

              {/* Seat Counter */}
              <div className="bg-surface-dark border border-[#382a29] rounded p-4 mb-8 flex items-center justify-between shadow-inner shadow-black/40">
                <div className="flex flex-col">
                  <span className="text-[#b7a09e] text-xs uppercase tracking-widest font-mono mb-1">Seats Remaining</span>
                  <div className="flex items-end gap-1">
                    <span className="text-white text-3xl font-mono font-bold">14</span>
                    <span className="w-2 h-4 bg-primary animate-pulse mb-1.5"></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#b7a09e] text-xs uppercase tracking-widest font-mono mb-1">Batch</span>
                  <div className="text-white font-mono font-bold">03/05</div>
                </div>
              </div>

              {/* Ticket Options */}
              <form className="flex flex-col gap-3 mb-8">
                {[
                  { name: 'Standard Access', desc: 'Live Stream Only', price: '₹1,999', checked: false },
                  { name: 'Professional Tier', desc: 'Stream + Recordings + Q&A', price: '₹4,999', checked: true },
                  { name: 'Enterprise Team', desc: 'Sold Out', price: '₹9,999', disabled: true },
                ].map((ticket, idx) => (
                  <label key={idx} className="cursor-pointer group relative">
                    <input className="peer sr-only" name="ticket" type="radio" defaultChecked={ticket.checked} disabled={ticket.disabled} />
                    <div className="p-4 rounded bg-transparent border border-[#382a29] peer-checked:border-blueprint-blue peer-checked:bg-blueprint-blue/10 hover:border-white/20 transition-all flex justify-between items-center opacity-60" style={{ opacity: ticket.disabled ? 0.6 : 1 }}>
                      <div>
                        <div className={`text-white font-bold text-sm ${ticket.disabled ? 'line-through text-[#b7a09e]' : ''}`}>{ticket.name}</div>
                        <div className="text-[#b7a09e] text-xs mt-1 font-mono">{ticket.desc}</div>
                      </div>
                      <div className="text-white font-mono">{ticket.price}</div>
                    </div>
                    {!ticket.disabled && <div className="absolute inset-0 border-2 border-blueprint-blue rounded pointer-events-none opacity-0 peer-checked:opacity-100"></div>}
                  </label>
                ))}
              </form>

              {/* CTA */}
              <div className="mt-auto">
                <Link href="/success" className="w-full bg-blueprint-blue hover:bg-blueprint-hover text-white font-bold py-4 px-6 rounded-sm transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-blueprint-blue/20">
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span className="uppercase tracking-wide">Join Waitlist</span>
                </Link>
                <p className="text-center text-[#b7a09e] text-xs mt-4 font-mono">
                  <span className="material-symbols-outlined text-[14px] align-middle relative -top-[1px]">lock</span>
                  Secured by GoTicket Guarantee
                </p>
              </div>
            </div>

            {/* Mini Footer in Sidebar */}
            <div className="border-t border-[#382a29] p-6 bg-[#171211]">
              <div className="flex items-center justify-between text-[#b7a09e] text-xs font-mono">
                <span>© 2023 GoTicket Inc.</span>
                <div className="flex gap-4">
                  <a className="hover:text-white" href="#">Help</a>
                  <a className="hover:text-white" href="#">Privacy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
