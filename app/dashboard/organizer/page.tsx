'use client'

export default function OrganizerDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased selection:bg-primary selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="flex w-72 flex-col justify-between border-r border-surface-border bg-background-dark p-4 shrink-0 fixed h-full z-20">
        <div className="flex flex-col gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-1 ring-white/10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDxqRq_u6XysxZhRCda4Gb9J9hR0OfD8VBGzSbAfZbVZocKxtjtjqNKO1nbOx6EnO_ghIO5sL0KEuT7HKgYx7yRTAuSOlZRm8wAcj-9V33_cai3tkHUsV4QJPngoNZXe8Q2FRY2koY5wFhI3dQW28-8YLCZdxhQ7Qxf34t8tihXysjvMUUBGTFZIeEXdwFz_dDR_Y7W-SsKBRqhAcEp_C83vxCyLwdxujGMuij5D_zXa0hwRS0dkmxjav0WLYVNYmPrySc8-Cw2ZpI")'}}></div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold tracking-tight">GoTicket</h1>
              <p className="text-stone-400 text-xs font-mono uppercase tracking-wider">Organizer Pro</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded bg-surface-border text-white group transition-colors" href="#">
              <span className="material-symbols-outlined text-primary" style={{fontSize: '20px'}}>dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/5 text-stone-400 hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined" style={{fontSize: '20px'}}>calendar_month</span>
              <span className="text-sm font-medium">Events</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/5 text-stone-400 hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined" style={{fontSize: '20px'}}>group</span>
              <span className="text-sm font-medium">Attendees</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/5 text-stone-400 hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined" style={{fontSize: '20px'}}>payments</span>
              <span className="text-sm font-medium">Finance</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/5 text-stone-400 hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined" style={{fontSize: '20px'}}>analytics</span>
              <span className="text-sm font-medium">Analytics</span>
            </a>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-4">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/5 text-stone-400 hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>settings</span>
            <span className="text-sm font-medium">Settings</span>
          </a>
          <div className="h-px w-full bg-surface-border"></div>
          <div className="px-2 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-stone-700 flex items-center justify-center text-xs font-bold text-white">MK</div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">Mike K.</span>
                <span className="text-[10px] text-stone-500 font-mono">Admin</span>
              </div>
            </div>
            <button className="text-stone-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined" style={{fontSize: '20px'}}>logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col ml-72 h-screen overflow-y-auto bg-background-dark relative">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md border-b border-surface-border px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
              <span>Events</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-white">Q3 Developer Summit</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Organizer Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-white text-sm font-mono">Sep 24, 2023</span>
              <span className="text-stone-500 text-xs font-mono">09:00 AM PST</span>
            </div>
            <button className="flex items-center justify-center size-10 rounded border border-surface-border text-stone-400 hover:text-white hover:bg-surface-border transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center gap-2 h-10 px-4 bg-primary hover:bg-red-600 text-white text-sm font-bold rounded transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg">add</span>
              Create Event
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
          {/* KPI Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feature: Capacity Arc */}
            <div className="col-span-1 lg:col-span-1 bg-surface-dark border border-surface-border rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-white">confirmation_number</span>
              </div>
              <div className="flex justify-between items-start z-10">
                <div>
                  <h3 className="text-stone-400 text-sm font-medium uppercase tracking-wider">Ticket Velocity</h3>
                  <p className="text-white text-3xl font-bold mt-1 tracking-tight">Strong Demand</p>
                </div>
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded border border-green-500/20 font-mono">+12% vs LY</span>
              </div>
              <div className="flex items-center justify-center py-6">
                <div className="relative size-48">
                  <svg className="size-full" viewBox="0 0 100 100">
                    <circle className="text-surface-border stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                    <circle className="text-primary stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="251.2" strokeDashoffset="40.2" strokeLinecap="round" strokeWidth="8" style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.35s'}}></circle>
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white tracking-tighter">84%</span>
                    <span className="text-xs text-stone-400 font-mono mt-1">SOLD</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-surface-border pt-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-stone-500 mb-1">Total Capacity</span>
                  <span className="text-white font-mono font-medium">500 Seats</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-stone-500 mb-1">Booked</span>
                  <span className="text-white font-mono font-medium">420</span>
                </div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Metric Card 1 */}
              <div className="bg-surface-dark border border-surface-border rounded-lg p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-surface-border rounded text-white">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <span className="text-green-500 text-xs font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 12.5%
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-stone-400 text-sm font-medium">Total Revenue</h3>
                  <p className="text-white text-3xl font-mono font-bold mt-1">$42,500</p>
                </div>
                <div className="mt-4 h-1 w-full bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full bg-white w-3/4"></div>
                </div>
              </div>

              {/* Metric Card 2 */}
              <div className="bg-surface-dark border border-surface-border rounded-lg p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-surface-border rounded text-white">
                    <span className="material-symbols-outlined">visibility</span>
                  </div>
                  <span className="text-green-500 text-xs font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 5.2%
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-stone-400 text-sm font-medium">Page Views</h3>
                  <p className="text-white text-3xl font-mono font-bold mt-1">12,450</p>
                </div>
                <div className="mt-4 h-1 w-full bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full bg-stone-500 w-1/2"></div>
                </div>
              </div>

              {/* Metric Card 3 */}
              <div className="bg-surface-dark border border-surface-border rounded-lg p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-surface-border rounded text-white">
                    <span className="material-symbols-outlined">confirmation_number</span>
                  </div>
                  <span className="text-primary text-xs font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_down</span> 0.4%
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-stone-400 text-sm font-medium">Conversion Rate</h3>
                  <p className="text-white text-3xl font-mono font-bold mt-1">3.2%</p>
                </div>
              </div>

              {/* Metric Card 4 */}
              <div className="bg-surface-dark border border-surface-border rounded-lg p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-surface-border rounded text-white">
                    <span className="material-symbols-outlined">confirmation_number</span>
                  </div>
                  <span className="text-green-500 text-xs font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 2.1%
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-stone-400 text-sm font-medium">Avg. Ticket Price</h3>
                  <p className="text-white text-3xl font-mono font-bold mt-1">$185.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registrants Section */}
          <div className="flex flex-col gap-5 mt-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white">Registrants</h3>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-stone-500 group-focus-within:text-white transition-colors">search</span>
                  </div>
                  <input className="bg-background-dark border border-surface-border text-white text-sm rounded focus:ring-1 focus:ring-primary focus:border-primary block w-64 pl-10 p-2.5 placeholder-stone-600 font-mono" placeholder="Search attendees..." type="text"/>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-background-dark border border-surface-border text-stone-300 hover:text-white hover:bg-surface-border rounded text-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                  Filter
                </button>
                <div className="h-6 w-px bg-surface-border mx-1"></div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-background-dark border border-surface-border text-stone-300 hover:text-white hover:bg-surface-border rounded text-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-lg">download</span>
                  CSV
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-red-600 text-white rounded text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  Add Attendee
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="relative overflow-x-auto rounded border border-surface-border bg-surface-dark">
              <table className="w-full text-sm text-left text-stone-400">
                <thead className="text-xs text-stone-500 uppercase bg-surface-border/50 border-b border-surface-border font-mono">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-wider">Attendee</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Ticket Type</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Registration Date</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Amount</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-mono">
                  {[
                    { name: 'Alex Vorn', email: 'alex.v@example.com', ticket: 'VIP Pass', date: 'Sep 22, 2023', time: '14:30 PM', amount: '$450.00', status: 'Confirmed', statusColor: 'green' },
                    { name: 'Sarah Jenkins', email: 'sarah.j@designco.io', ticket: 'Early Bird', date: 'Sep 21, 2023', time: '09:15 AM', amount: '$150.00', status: 'Waitlisted', statusColor: 'amber' },
                    { name: 'Mike Torello', email: 'mike.dev@agency.net', ticket: 'General', date: 'Sep 20, 2023', time: '11:45 AM', amount: '$200.00', status: 'Cancelled', statusColor: 'gray' },
                    { name: 'Elena Wright', email: 'elena.w@startup.co', ticket: 'General', date: 'Sep 19, 2023', time: '16:20 PM', amount: '$280.00', status: 'Confirmed', statusColor: 'green' },
                  ].map((attendee, idx) => (
                    <tr key={idx} className="bg-surface-dark hover:bg-surface-border/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap flex items-center gap-3">
                        <div className="size-8 rounded bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-xs font-bold text-stone-300">
                          {attendee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display font-semibold">{attendee.name}</span>
                          <span className="text-xs text-stone-500 font-mono font-normal">{attendee.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded border ${attendee.ticket === 'VIP Pass' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-stone-700/30 text-stone-300 border-stone-600/30'}`}>
                          {attendee.ticket}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {attendee.date} <span className="text-stone-600 text-xs block">{attendee.time}</span>
                      </td>
                      <td className={`px-6 py-4 ${attendee.status === 'Cancelled' ? 'text-stone-500 line-through decoration-stone-500' : 'text-white'}`}>
                        {attendee.amount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {attendee.statusColor === 'green' && (
                            <>
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                              </span>
                              <span className="text-green-500 font-medium">Confirmed</span>
                            </>
                          )}
                          {attendee.statusColor === 'amber' && (
                            <>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                              <span className="text-amber-500 font-medium">Waitlisted</span>
                            </>
                          )}
                          {attendee.statusColor === 'gray' && (
                            <>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-600"></span>
                              <span className="text-stone-500 font-medium">Cancelled</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-stone-500 hover:text-white transition-colors">
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
