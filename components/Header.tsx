'use client'
 
import Link from 'next/link'
import { useState, useEffect } from 'react'
 
export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
 
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])
 
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setIsAuthenticated(false)
    setUser(null)
    window.location.href = '/'
  }
 
  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E03A2F] to-orange-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">event</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">GoTicket</span>
          </Link>
 
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-[#E03A2F] transition-colors">Home</Link>
            <Link href="/events" className="text-[#E03A2F] font-medium">Events</Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-[#E03A2F] transition-colors">About</Link>
          </nav>
 
          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#E03A2F] transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
 
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600 text-sm">person</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.full_name || 'User'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">
                  <span className="material-symbols-outlined text-sm">login</span>
                  Login
                </Link>
                <Link href="/register" className="hidden sm:flex items-center gap-2 bg-[#E03A2F] hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Register
                </Link>
              </>
            )}
 
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-slate-600 dark:text-slate-300 hover:text-[#E03A2F]">
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}