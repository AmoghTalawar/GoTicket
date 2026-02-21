// GoTicket API Client
// Centralized helper for communicating with the Go backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// =====================================================
// Auth Token Management
// =====================================================

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

// =====================================================
// Generic Fetch Helper
// =====================================================

async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
}

// =====================================================
// Auth API
// =====================================================

export async function loginUser(email: string, password: string) {
  const data = await apiFetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  username?: string;
}) {
  const data = await apiFetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function getProfile() {
  return apiFetch('/api/profile');
}

// =====================================================
// Events API
// =====================================================

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
  price: number;
  capacity: number | null;
  organizer_id: string;
  image_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function fetchEvents(params?: {
  category?: string;
  search?: string;
}): Promise<{ events: Event[]; count: number }> {
  let query = '';
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  }
  return apiFetch(`/api/events${query}`);
}

export async function fetchEventById(
  id: string
): Promise<{ event: Event; registration_count: number }> {
  return apiFetch(`/api/events/${id}`);
}

export async function createEvent(payload: {
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  category?: string;
  price?: number;
  capacity?: number;
  image_url?: string;
}) {
  return apiFetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateEvent(id: string, payload: Record<string, any>) {
  return apiFetch(`/api/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteEvent(id: string) {
  return apiFetch(`/api/events/${id}`, {
    method: 'DELETE',
  });
}

// =====================================================
// Registrations API
// =====================================================

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  status: string;
  notes: string;
  created_at: string;
  events?: Event;
}

export async function fetchRegistrations(status?: string): Promise<{
  registrations: Registration[];
  count: number;
}> {
  const query = status ? `?status=${status}` : '';
  return apiFetch(`/api/registrations${query}`);
}

export async function registerForEvent(payload: {
  event_id: string;
  notes?: string;
}) {
  return apiFetch('/api/registrations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function cancelRegistration(registrationId: string) {
  return apiFetch('/api/registrations/cancel', {
    method: 'POST',
    body: JSON.stringify({ registration_id: registrationId }),
  });
}

// =====================================================
// Utility: Format price in INR
// =====================================================

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
