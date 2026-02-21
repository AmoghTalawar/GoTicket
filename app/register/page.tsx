'use client'

import Link from 'next/link'
import { useState } from 'react'

// Environment configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface RegisterFormData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Input validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          phone_number: formData.phone,
          username: formData.fullName.toLowerCase().replace(/\s/g, '_')
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: 'An account with this email already exists' })
        } else if (response.status === 429) {
          setErrors({ general: 'Too many attempts. Please try again later.' })
        } else {
          setErrors({ general: data.message || 'Registration failed. Please try again.' })
        }
        return
      }

      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
      }

      setIsSuccess(true)
      setTimeout(() => { window.location.href = '/' }, 2000)
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#f5f7f8] text-slate-900 font-display min-h-screen flex flex-col antialiased selection:bg-primary/20">
      {/* Navigation / Brand Header */}
      <nav className="w-full px-8 py-6 absolute top-0 left-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 bg-[#E03A2F] rounded text-white shadow-lg shadow-[#E03A2F]/50 group-hover:shadow-[#E03A2F]/75 group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-lg">confirmation_number</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#E03A2F] transition-colors duration-300">GoTicket</span>
          </Link>
        </div>
        <a className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#">Help Center</a>
      </nav>

      {/* Main Content Area */}
      <main className="relative flex-1 w-full flex items-center justify-center p-4 sm:p-8 bg-grid overflow-hidden">
        {/* Registration Card Container */}
        <div className="relative w-full max-w-[480px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col z-10 animate-fade-in-up">
          {/* Signal Red Accent Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-signal-red"></div>
          <div className="pl-10 pr-8 py-10 sm:py-12 sm:pr-12">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="font-editorial text-4xl sm:text-5xl text-slate-900 mb-3 leading-[1.1]">
                Join the future of events
              </h1>
              <p className="text-slate-500 font-medium text-base">
                Secure your access to exclusive experiences.
              </p>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 text-sm font-medium">Registration successful! Redirecting...</p>
              </div>
            )}

            {/* Registration Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-900 font-modern" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  className={`w-full h-12 px-4 rounded-md border ${errors.fullName ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-primary'} bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent font-modern text-base transition-all`}
                  id="fullName"
                  placeholder="Enter your full name"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading || isSuccess}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-900 font-modern" htmlFor="email">
                  Email Address *
                </label>
                <input
                  className={`w-full h-12 px-4 rounded-md border ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-primary'} bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent font-modern text-base transition-all`}
                  id="email"
                  placeholder="your.email@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading || isSuccess}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-900 font-modern" htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  className={`w-full h-12 px-4 rounded-md border ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-primary'} bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent font-modern text-base transition-all`}
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading || isSuccess}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-900 font-modern" htmlFor="password">
                  Password *
                </label>
                <input
                  className={`w-full h-12 px-4 rounded-md border ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-primary'} bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent font-modern text-base transition-all`}
                  id="password"
                  placeholder="Create a strong password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading || isSuccess}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                <p className="text-slate-400 text-xs">Must be at least 8 characters with uppercase, lowercase, and number</p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-900 font-modern" htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <input
                  className={`w-full h-12 px-4 rounded-md border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-primary'} bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent font-modern text-base transition-all`}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading || isSuccess}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Primary Action */}
              <div className="pt-2">
                <button
                  className="w-full h-12 bg-[#E03A2F] hover:bg-red-600 text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading || isSuccess}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin material-symbols-outlined text-lg">refresh</span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-slate-500 font-medium">or register with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 h-11 px-4 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors text-slate-900 font-semibold text-sm disabled:opacity-50" disabled={isLoading || isSuccess}>
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 h-11 px-4 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors text-slate-900 font-semibold text-sm disabled:opacity-50" disabled={isLoading || isSuccess}>
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
                GitHub
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?
                <Link href="/login" className="text-[#E03A2F] hover:text-red-700 font-semibold transition-colors"> Log in</Link>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-8 text-xs text-center text-slate-400">
              By joining, you agree to our <a className="underline hover:text-slate-600" href="#">Terms of Service</a> and <a className="underline hover:text-slate-600" href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
