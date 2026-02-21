'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    if (token && userData) {
      router.push('/')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Clear API error when user starts typing
    if (apiError) {
      setApiError('')
    }
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setApiError('')

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store auth token and user data
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))

      setIsSuccess(true)

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (error: any) {
      setApiError(error.message || 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden font-display bg-background-light dark:bg-background-dark text-ink antialiased">
      {/* Left Panel: Editorial Visual */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Event crowd background"
            className="h-full w-full object-cover opacity-60 grayscale mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPy4ZFHC_G_94QQ4YetI4-n9TmdI6Quh_h8XKSIKzQ-eanBr3fHCbIuAKbYKb9ymI5CTJ0BGdzdYM6KgRdIK-34bxLHsffKvxXQZqaSXqt3EwBN0XBpoal6te5wGFp3hhQwPk8ol5yL5Mte__qFzP4lEiI27l309DdwLuTZbYnR4Qa4IMVKVNLZKdqM89TnD_CzI3golB0cNFW8i7xiqLimDuZZWBbfp5MWDibQBfIDNr3fMZDqxOxgdvko3gJAxoLJA8pAB4FbBQB"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 mix-blend-multiply"></div>
        </div>

        {/* Brand Logo */}
        <div className="relative z-10 px-12 py-10">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-[#E03A2F] transition-colors duration-300">
            <span className="material-symbols-outlined text-4xl">confirmation_number</span>
            <h2 className="text-3xl font-extrabold tracking-tight">GoTicket</h2>
          </Link>
        </div>

        {/* Editorial Tagline */}
        <div className="relative z-10 px-12 py-16 max-w-xl">
          <h1 className="text-white text-5xl font-black leading-[1.1] tracking-tight mb-6">
            Editorial Urgency. <br />
            <span className="text-white/70 font-normal italic">Experience the thrill of the crowd.</span>
          </h1>
          <p className="text-stone-300 text-lg font-medium max-w-md leading-relaxed">
            Join the premier platform for exclusive event access. Where moments become memories.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f6f3ee] dark:bg-background-dark px-6 py-12 lg:px-24">
        <div className="w-full max-w-[440px] flex flex-col gap-10">
          {/* Mobile Header (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-3xl text-primary">confirmation_number</span>
            <span className="text-2xl font-bold">GoTicket</span>
          </div>

          {/* Form Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight">Login</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">Welcome back. Please enter your details.</p>
          </div>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-3xl">check</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Login Successful!</h3>
              <p className="text-slate-500 dark:text-slate-400">Redirecting to home page...</p>
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {apiError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-600 text-sm">
                  {apiError}
                </div>
              )}

              {/* Email Field */}
              <label className="flex flex-col gap-2 group">
                <span className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">Email Address</span>
                <div className="relative">
                  <input
                    className={`w-full h-14 rounded-lg bg-white dark:bg-white/5 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-0 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-slate-300 dark:hover:border-slate-600`}
                    placeholder="name@example.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">mail</span>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </label>

              {/* Password Field */}
              <label className="flex flex-col gap-2 group">
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">Password</span>
                  <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Forgot Password?</a>
                </div>
                <div className="relative">
                  <input
                    className={`w-full h-14 rounded-lg bg-white dark:bg-white/5 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-0 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-slate-300 dark:hover:border-slate-600`}
                    placeholder="••••••••"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">lock</span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex h-14 w-full items-center justify-center rounded-lg bg-[#E03A2F] hover:bg-red-600 transition-colors text-white text-base font-bold tracking-wide shadow-lg shadow-[#E03A2F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
            </div>
          </div>

          {/* Footer / Sign Up */}
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Don't have an account?
              <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1" href="/register">Sign up for free</Link>
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mt-2">
              <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Privacy</a>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Terms</a>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
