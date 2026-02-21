'use client'

import Link from 'next/link'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col antialiased selection:bg-primary/20 overflow-x-hidden">
      <Header />

      <main className="flex-grow animate-fade-in">
        {/* Hero Section */}
        <section className="relative border-b border-border-dark overflow-hidden animate-gradient-shift">
          <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.15] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark pointer-events-none"></div>
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="flex flex-col lg:flex-row gap-12 items-center animate-slide-up">
              {/* Hero Content */}
              <div className="flex-1 space-y-8 z-10 animate-fade-in-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Live Now
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight text-white animate-text-reveal">
                  Secure Your Spot at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">World's Premier</span> Experiences.
                </h1>
                <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                  Curated events. Instant access. Zero friction. Join the platform designed for the urgent seeker of exclusive moments.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/events" className="h-12 px-8 bg-[#E03A2F] hover:bg-[#E03A2F]-dark text-white font-bold rounded flex items-center justify-center transition-all group animate-scale-in">
                    Explore Events
                    <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                  </Link>
                  <button className="h-12 px-8 border border-slate-600 hover:border-white text-white font-medium rounded flex items-center justify-center transition-colors animate-scale-in">
                    View Calendar
                  </button>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="flex-1 w-full lg:w-auto relative aspect-[4/3] lg:aspect-square max-w-lg lg:max-w-xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-lg transform rotate-3"></div>
                <div
                  className="absolute inset-0 bg-surface-dark border border-border-dark rounded-lg overflow-hidden shadow-2xl bg-cover bg-center"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-HS75M0xPd3ULsKFEWUyaBTti53wjDAmKBbFRDax_h4wdL-87jPRv9xIcB0bapqyQbCUSaqBjQr3y0A7ZTg742V9Ra0u76RZ06KwbWBos30YBGhi9bvDLba76-gqeQ1f6mi0ozoaI8G_l-tHqw4M1nGzMVBx4PCVR1Tj3ji8Nc_fOMlXpsVHDPjwaCt8czq4s6XJCDYZ7jDO1eSDlxpxzyMV2FTZ7W-q6CPlO1xtzcfPjcF5F9Z-eIeTEziwSQViLXITVS0GGOpA_')" }}
                >
                  <div className="absolute inset-0 bg-black/40"></div>
                  {/* Floating UI Card */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-background-dark/90 backdrop-blur-md border border-border-dark rounded shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Trending</span>
                      <span className="text-xs text-slate-400">Oct 14-16</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Neon Horizon Festival</h3>
                    <p className="text-sm text-slate-400">Downtown Arena • 3 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border-dark bg-surface-dark py-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col border-l border-border-dark pl-6">
                <span className="text-3xl font-bold text-white">2M+</span>
                <span className="text-sm text-slate-500 uppercase tracking-wide">Tickets Sold</span>
              </div>
              <div className="flex flex-col border-l border-border-dark pl-6">
                <span className="text-3xl font-bold text-white">50k+</span>
                <span className="text-sm text-slate-500 uppercase tracking-wide">Events Hosted</span>
              </div>
              <div className="flex flex-col border-l border-border-dark pl-6">
                <span className="text-3xl font-bold text-white">100%</span>
                <span className="text-sm text-slate-500 uppercase tracking-wide">Secure Checkout</span>
              </div>
              <div className="flex flex-col border-l border-border-dark pl-6">
                <span className="text-3xl font-bold text-white">24/7</span>
                <span className="text-sm text-slate-500 uppercase tracking-wide">Live Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Event Section */}
        <section className="py-20 bg-background-dark">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Event</h2>
                <p className="text-slate-400">Hand-picked by our editors for the ultimate experience.</p>
              </div>
              <Link href="/events" className="hidden md:flex items-center gap-1 text-primary hover:text-primary-dark font-medium transition-colors">
                View all events <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            <div className="grid lg:grid-cols-12 gap-0 border border-border-dark rounded-lg overflow-hidden bg-surface-dark shadow-2xl">
              {/* Left: Event Image */}
              <div className="lg:col-span-7 relative min-h-[400px] lg:min-h-[500px] group overflow-hidden bg-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnAAalWMeUl24bGRzJ-D35-r485mUvS70DXZdAhozoZE84S6yUbTsqNz0FJl4OcdjOYfRz6qnew6T275XEMdeGGRemVreZgZSoe-ELwgjWlT-f76mLeFVPyNjNhTHs-YDA0MvQ_eNZVfWankUvQanEAi-E26itf-D6MxultIxRFgjBUUTKafMB3uK2oPDXxtMArFFw0kwb30-ef2GorYVJLVPseKd-VReiqHNfTn0a4aTV_Q0TCBipTtLP1ao-CY8ePyoedMDcszSO')" }}
                >
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center relative border-l border-border-dark">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
                <h3 className="text-4xl font-bold text-white leading-[1.1] mb-4">Neon Horizon Music Festival</h3>
                <p className="text-lg text-slate-400 leading-relaxed mb-8">Experience the future of sound in an immersive 3-day journey featuring world-class electronic artists and interactive art installations.</p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs uppercase tracking-wide font-medium">Date</span>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                      Oct 14-16, 2023
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs uppercase tracking-wide font-medium">Location</span>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                      Downtown Arena
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs uppercase tracking-wide font-medium">Price</span>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <span className="material-symbols-outlined text-primary text-lg">payments</span>
                      Starting at ₹4,999
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs uppercase tracking-wide font-medium">Age</span>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <span className="material-symbols-outlined text-primary text-lg">verified</span>
                      18+ Only
                    </div>
                  </div>
                </div>

                {/* Urgency Component */}
                <div className="bg-black/30 rounded p-5 border border-primary/20 mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-white font-bold flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Selling Fast
                      </p>
                      <p className="text-primary text-sm mt-1">Only 12 tickets left at this price.</p>
                    </div>
                    <p className="text-white font-bold text-xl">98%</p>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Link href="/events/advanced-concurrency" className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg h-14 rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(226,56,44,0.3)] hover:shadow-[0_0_30px_rgba(226,56,44,0.5)]">
                    Register Now
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                  <p className="text-center text-xs text-slate-500 mt-2">Secure checkout powered by Stripe. No hidden fees.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Upcoming Experiences */}
        <section className="py-16 bg-surface-dark border-t border-border-dark">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-white mb-8">More Upcoming Experiences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="group relative bg-background-dark border border-border-dark rounded overflow-hidden hover:border-primary/50 transition-colors">
                <div
                  className="aspect-video w-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCH6ppB35qwhqZZOmIZULUhd6CM4AwA5QK3f0wlHnZ0-f0FtKRZE3btd4GDX6oo4Nfn3LZbM0aA2AVNDO6dqJdEBE0ePmrVASS0k0VVNObdqp_g8OUIsZEmhJmNOwzpGLeKcoWAY5_-wNyaYYjuqrLZt1166VvnHUaf4Pp8SEyltvusO40WosbNDtSdOXavwwxRd8dgDrIc2e7JyjZ9XXs7PXDzOsA83Ikb9S0fAlFPk1NQpHoX9hZFpMP4nXae1aw-HSDHgQ8yKZvH')" }}
                ></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase">Art & Design</span>
                    <span className="text-sm text-slate-400">Nov 12</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Modernist Sculptures</h4>
                  <p className="text-sm text-slate-500 mb-4">The Gallery, NY</p>
                  <div className="flex justify-between items-center border-t border-border-dark pt-4">
                    <span className="text-white font-medium">₹999</span>
                    <button className="text-sm text-white font-medium hover:text-primary">Tickets</button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-background-dark border border-border-dark rounded overflow-hidden hover:border-primary/50 transition-colors">
                <div
                  className="aspect-video w-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdD0mziOFOEmXK4X6ef9EaQYbtuvQt9SBhzpqMN3_yGJt4bgXpbInRnF2u5y8Ri_OPsMVXQYMTUSe228mEWVBWCU9uBPIfgcFszvVhvVxTAcHW_dSOjQk5YmqEiKKIhC67Py_yvCN6lyZPwC-TWUShc6HKaYtRZPM5umJBt1tntLDCyHHq0RrRg0DoHoW7D4BYEc7MaVexl_-C1Fkt2auYmk92qU4Ipcy0zU_e9LSRZ9onb_GTQ8Lt0eYgp5vSZ7JfJdlsk5NCkZ_c')" }}
                ></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase">Business</span>
                    <span className="text-sm text-slate-400">Dec 05</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Future Tech Summit</h4>
                  <p className="text-sm text-slate-500 mb-4">Convention Center, SF</p>
                  <div className="flex justify-between items-center border-t border-border-dark pt-4">
                    <span className="text-white font-medium">₹8,999</span>
                    <button className="text-sm text-white font-medium hover:text-primary">Register</button>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-background-dark border border-border-dark rounded overflow-hidden hover:border-primary/50 transition-colors">
                <div
                  className="aspect-video w-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6s4lmwn0uUHmckkjnv3YpadJmCxcbeAU8-KB1IzBGdhVROUwJNMBB_W89XxoL4b5Y6dTGKDGS3Sn3R7A-MNZ2dxZ5qievPTGI4yQEgL33aefdqgqSAqQ4SNHoEc4HWy-02209JCBhpdLFp_5halpm7BvKaDjV60zH3J0HwMMOKLdxWezvLWznbffjTvdYVwBn6buR47bCBkqy77mf0KUF_7hMYHVxZwRButurpRQArFBVQ227iuZxB5jWsRodNssvTLkKEw8ospWL')" }}
                ></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase">Nightlife</span>
                    <span className="text-sm text-slate-400">Tonight</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Underground Bass</h4>
                  <p className="text-sm text-slate-500 mb-4">Warehouse 42, LDN</p>
                  <div className="flex justify-between items-center border-t border-border-dark pt-4">
                    <span className="text-white font-medium">₹499</span>
                    <button className="text-sm text-white font-medium hover:text-primary">Guestlist</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="border-t border-border-dark bg-background-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">mail</span>
              <h2 className="text-3xl font-bold text-white mb-4">Don't miss the drop.</h2>
              <p className="text-slate-400 mb-8">Get exclusive access to pre-sales and secret locations delivered to your inbox.</p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input className="flex-1 bg-surface-dark border border-border-dark text-white rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Enter your email" type="email" />
                <button className="bg-white text-black font-bold px-8 py-3 rounded hover:bg-slate-200 transition-colors">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-dark border-t border-border-dark py-12">
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
  )
}
