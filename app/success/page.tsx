export default function SuccessPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern bg-[length:52px_52px]"></div>

      {/* Top Navigation */}
      <header className="relative z-20 flex items-center justify-between whitespace-nowrap border-b border-black/5 px-10 py-4 bg-background-light/80 backdrop-blur-sm dark:bg-background-dark/80 dark:border-white/10">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="size-6 text-primary">
            <span className="material-symbols-outlined !text-[28px]">confirmation_number</span>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.02em]">GoTicket</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-9">
            <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Events</a>
            <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Magazine</a>
            <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Support</a>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-lg h-9 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold">
              <span>Log In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-6">
        {/* Decorative Confetti (Absolute Positioned) */}
        <div className="confetti confetti-square top-[20%] left-[25%] rotate-12 opacity-80"></div>
        <div className="confetti confetti-circle top-[15%] right-[28%] opacity-60"></div>
        <div className="confetti confetti-triangle top-[30%] right-[20%] rotate-45 opacity-70"></div>

        <div className="w-full max-w-[640px] flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="mb-8 relative animate-pop-in">
            <div className="size-24 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/20 relative z-10">
              <span className="material-symbols-outlined text-white !text-[48px] font-bold">check</span>
            </div>
            {/* Radial burst effect behind */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
          </div>

          {/* Headlines */}
          <div className="flex flex-col gap-4 mb-10 animate-slide-up opacity-0">
            <h1 className="font-serif italic text-5xl md:text-6xl text-slate-900 dark:text-white leading-tight tracking-tight">
              Registration Confirmed!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-[480px] mx-auto leading-relaxed">
              You're officially on the list for Go Workshop 2026. A confirmation email has been sent to your inbox.
            </p>
          </div>

          {/* Transaction Summary Card */}
          <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-1 animate-slide-up opacity-0" style={{animationDelay: '0.3s'}}>
            <div className="flex flex-col md:flex-row">
              {/* Event Image Side */}
              <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden rounded-lg md:rounded-l-lg md:rounded-r-none group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_m2fmzAa9lG9l3t06Dg0VmKzY3xLMMu6cnNc_dbnVLH49z_CqlOOpx-oWmmpr1IqlWkSnscSWriTZvXknIj3VqJcEhxhg0FmpZ_0Qw5Cu7sPYKPtzbLl29H4gv5Dz3vFnXuXpNDhArqjErzrh3Llp0rldGOGHnzCPz6Z9hlBsV8jN11RED-8D2BG7ThZYY3tEDBBpR4uBGzkduTkgjJlMBOkbEKLASclCKnhEwwk_g9PDzIgehy6COwdcBCMbTb00JmpJB4t-T9OE')"}}
                >
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <span className="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Upcoming</span>
                </div>
              </div>

              {/* Details Side */}
              <div className="flex-1 p-6 md:p-8 text-left flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Go Workshop 2026</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined !text-[16px]">calendar_today</span>
                      Oct 12-14, 2026
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined !text-[16px]">location_on</span>
                      San Francisco, CA
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded text-right">
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Reg ID</span>
                    <span className="font-mono text-primary text-sm font-bold tracking-tight">REG-2026-X</span>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-4"></div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-secondary-blue hover:bg-blue-900 text-white h-11 px-6 rounded-lg font-bold text-sm transition-all shadow-sm hover:shadow-md">
                    <span className="material-symbols-outlined !text-[18px]">calendar_add_on</span>
                    Add to Calendar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 h-11 px-6 rounded-lg font-bold text-sm transition-all">
                    <span className="material-symbols-outlined !text-[18px]">download</span>
                    Download Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-12 flex gap-6 text-slate-400 text-sm animate-slide-up opacity-0" style={{animationDelay: '0.5s'}}>
            <a className="hover:text-primary transition-colors" href="#">Order Details</a>
            <span>•</span>
            <a className="hover:text-primary transition-colors" href="#">Need Help?</a>
          </div>
        </div>
      </main>

      {/* Bottom Footer (Subtle) */}
      <footer className="relative z-10 py-6 text-center text-slate-400 text-xs font-medium">
        <p>© 2026 GoTicket Platform. Editorial Urgency.</p>
      </footer>
    </div>
  )
}
