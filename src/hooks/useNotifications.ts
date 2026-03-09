import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useNotificationStore } from '../store/notificationStore'

// ── Service calls (mock) ───────────────────────────────────────────────────────
// These will be replaced by real API calls when backend is ready.
// Each returns only the counts — lightweight endpoints, no full data payload.

async function fetchDirectriceCounts(): Promise<{ messagesNonLus: number; comptesEnAttente: number }> {
  // ── MOCK ────────────────────────────────────────────────────────────────────
  await new Promise((r) => setTimeout(r, 200))
  return { messagesNonLus: 3, comptesEnAttente: 2 }
  // ── REAL API ─────────────────────────────────────────────────────────────────
  // const res = await api.get('/notifications/directrice')
  // return res.data
}

async function fetchCSDCounts(): Promise<{ dossiersEnAttente: number; csdMessagesNonLus: number }> {
  // ── MOCK ────────────────────────────────────────────────────────────────────
  await new Promise((r) => setTimeout(r, 200))
  return { dossiersEnAttente: 4, csdMessagesNonLus: 1 }
  // ── REAL API ─────────────────────────────────────────────────────────────────
  // const res = await api.get('/notifications/csd')
  // return res.data
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// Call this ONCE at the top of the app (in App.tsx) after authentication.
// It fetches counts for the correct role and populates the notification store.
// All navbars then read from the store — they never fetch themselves.

export function useNotifications() {
  const { isAuthenticated, isDirectrice, isCSD } = useAuth()
  const { isLoaded, setDirectriceCounts, setCSDCounts } = useNotificationStore()

  useEffect(() => {
    // Only fetch if authenticated and not already loaded
    if (!isAuthenticated || isLoaded) return

    if (isDirectrice) {
      fetchDirectriceCounts().then(setDirectriceCounts).catch(console.error)
    } else if (isCSD) {
      fetchCSDCounts().then(setCSDCounts).catch(console.error)
    }
    // Enseignants have no global notification counts in the navbar
  }, [isAuthenticated, isDirectrice, isCSD, isLoaded, setDirectriceCounts, setCSDCounts])
}
