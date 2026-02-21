export default function MyRegistrationsPage() {
  const events = [
    {
      title: 'Future of Fintech Summit 2024',
      date: 'OCT 24',
      time: '09:00 AM - 05:00 PM',
      location: 'Javits Center, NYC',
      status: 'Confirmed',
      statusColor: 'success',
      orderId: '#ORD-9281',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsPpyZZGX065h2vPNqzBhjBHPu9VVOXJu5rZhbwsd5u1mqSOMoSyUGxEFVBu-1BCSegx2RdQdZ0wM939PMvkh14qXAiTrRkpcp4kPjuOSpDmlwCzpWUQkGmaCEkAA_Pa2LaD407_qHMSKNQZCPCAcnUT1g5UcPUOmlOzis7xuTJqiSeYaiuJLG2hwFloy0U5sVAVqFmw73pXhTDu_4VyjbMFkjUgNDIF_cAqTOTx8JtMvVgsZhvoQRLmtmO2meJz37xfN2QY-1Dy1C'
    },
    {
      title: 'Exclusive UX Workshop: Systems',
      date: 'NOV 12',
      time: '10:00 AM - 02:00 PM',
      location: 'Online Event',
      status: 'Waitlisted',
      statusColor: 'warning',
      position: '#03',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA70gaL4bULYWa6eAxj1JDO2cwgIhSts3lRZeQ8pAw77fI6leerxw1TGQICaesvS2quxN8E1j-WtOLEiDPqmbzY9gyOy-guH9-H55e69pepWmiGjrDIvCXf3g074UF7DrOtTqxmyMXea9cdov4m_JQtqL4L8n_AOFlEsUH00IyhmfDqAi875FgKsNCk4Ji297lO37KdhWAopXRTyxBiEcX8JJLv0BT-dRqHKuAJU5iRJqSTnv2F7stBeYfWx0bynbZXy8HWcK4zXBU3'
    },
    {
      title: 'AI & Design Ethics Panel',
      date: 'DEC 05',
      time: '06:30 PM - 08:30 PM',
      location: 'Design Museum, London',
      status: 'Confirmed',
      statusColor: 'success',
      orderId: '#ORD-10042',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXXVtfiBLT5ZaA5nKMPpkmgLIyOtpGgJV5gXVnpuDgTGJMf4PQHRhvBPdLH8KWWYrlD-O_baGJxsb_c352ExqzGX_piOxUMz2yswUch9ydFipJHu8wFgujKJZoJbO5Y458n9YwPWGh-MMKgouP_nX3Dw-Tk-fHyQe-ChqEEHtq-kLoi_-vB0QP8hvlpn-HhAGUgwn0SvcC5mZj9332Jqstceti-Yk_B2i_guyVL4KPL9g8mgUuRKisCvwjMfiF_aw0SkMejZLjAMjn'
    }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden">
      {/* Decorative Grid Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-10 bg-grid-pattern bg-grid"></div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 lg:px-10 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
            </div>
            <h2 className="text-[#111418] dark:text-white text-xl font-bold leading-tight tracking-tight font-serif">GoTicket</h2>
          </div>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <button className="hidden md:flex items-center justify-center rounded-lg h-10 w-10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#111418] dark:text-white">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none text-slate-900 dark:text-white group-hover:text-primary transition-colors">Alex Morgan</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">ID: #8821</p>
              </div>
              <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEQjGOu0Cb8vJsn1TjapAHMlQwylVk_F2rf1BaBc3Vds_4lctO-4ekAxO6X-uRHyD2vdzhxH0uufBy9jNh2O7-0cYhRaBS36R-kBw54ocR3LOVGLOKcRxSIWz2hiDMVju4ravFiKF-kSgFkkvB1c0huH1nSvliP4-7ryaSWcqZFvnfyNM6SXXyhw2CIaOVIbtbCXyov-mByjbqZDoLUgGOIWTz_r84J2Dtmlf9SQShlozeBUDivkUo_eMiqxryJ77VhFR5ZO-rWZzB")'}}></div>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div className="flex flex-1 w-full max-w-[1440px] mx-auto pt-8 pb-12 px-4 md:px-8 lg:px-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:flex w-64 flex-col gap-8 shrink-0 sticky top-28 h-fit">
            <div className="flex flex-col gap-1 pb-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mb-2">My Account</h3>
              <nav className="flex flex-col gap-1">
                <a className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium" href="#">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">event_available</span>
                    <span>Registrations</span>
                  </div>
                </a>
                <a className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                    <span>Saved Events</span>
                  </div>
                </a>
                <a className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    <span>Preferences</span>
                  </div>
                </a>
              </nav>
            </div>

            {/* Stats Widget */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Bookings</span>
                <span className="material-symbols-outlined text-slate-400 text-[20px]">confirmation_number</span>
              </div>
              <div>
                <span className="text-4xl font-bold font-serif text-slate-900 dark:text-white">3</span>
                <span className="text-sm text-slate-500 ml-1">events</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-primary h-full rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Next event in 2 days</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col gap-8 min-w-0">
            {/* Page Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 font-mono">Attendee View</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-[#111418] dark:text-white leading-tight">Your Events</h1>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex bg-slate-100 dark:bg-surface-dark p-1 rounded-lg w-fit self-start md:self-end">
                <button className="px-4 py-1.5 rounded-md bg-white dark:bg-slate-700 shadow-sm text-sm font-medium text-slate-900 dark:text-white transition-all">Upcoming</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all">Past</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all">Cancelled</button>
              </div>
            </div>

            {/* Event List */}
            <div className="flex flex-col gap-4">
              {events.map((event, idx) => (
                <div key={idx} className="group flex flex-col md:flex-row bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4 gap-6 hover:shadow-lg transition-all duration-300" style={{borderColor: event.statusColor === 'success' ? 'var(--tw-border-opacity)' : event.statusColor === 'warning' ? 'var(--tw-border-opacity)' : 'var(--tw-border-opacity)'}}>
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-full md:w-48 aspect-[4/3] md:aspect-auto md:h-32 rounded-lg overflow-hidden bg-slate-100">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: `url('${event.image}')`}}></div>
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-900 dark:text-white font-mono border border-black/5">
                      {event.date}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between py-1 gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          event.statusColor === 'success' 
                            ? 'bg-[#1A7A4A]/10 text-[#1A7A4A] border-[#1A7A4A]/20'
                            : 'bg-[#C97B1A]/10 text-[#C97B1A] border-[#C97B1A]/20'
                        }`}>
                          {event.statusColor === 'success' ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1A7A4A]"></span>
                              {event.status}
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                              {event.status}
                            </>
                          )}
                        </span>
                        {event.orderId && <span className="text-xs text-slate-400 font-mono">{event.orderId}</span>}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">schedule</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">{event.location === 'Online Event' ? 'videocam' : 'location_on'}</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 md:border-0 md:pt-0">
                      {event.position && <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                        You will be notified via email if a spot opens up. You have 24h to confirm.
                      </p>}
                      <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Download Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
              <span className="text-xs text-slate-500 font-mono">SHOWING 1-3 OF 15 EVENTS</span>
              <div className="flex gap-2">
                <button className="flex items-center justify-center w-8 h-8 rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="flex items-center justify-center w-8 h-8 rounded border border-primary text-primary font-medium">1</button>
                <button className="flex items-center justify-center w-8 h-8 rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors">2</button>
                <button className="flex items-center justify-center w-8 h-8 rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors">3</button>
                <button className="flex items-center justify-center w-8 h-8 rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
