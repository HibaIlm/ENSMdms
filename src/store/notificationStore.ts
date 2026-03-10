import { create } from 'zustand'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotificationCounts {
  messagesNonLus: number
  comptesEnAttente: number
  dossiersEnAttente: number   // CSD: dossiers assigned but not yet evaluated
  csdMessagesNonLus: number   // CSD member unread messages
}

interface NotificationState extends NotificationCounts {
  isLoaded: boolean
}

interface NotificationActions {
  setDirectriceCounts: (counts: Pick<NotificationCounts, 'messagesNonLus' | 'comptesEnAttente'>) => void
  setCSDCounts: (counts: Pick<NotificationCounts, 'dossiersEnAttente' | 'csdMessagesNonLus'>) => void
  // Granular updates — called when user takes an action (e.g. reads a message)
  decrementMessages: () => void
  decrementCSDMessages: () => void
  clearComptesEnAttente: () => void
}

// ── Store ─────────────────────────────────────────────────────────────────────
// Global notification counts — fetched once on app load, updated optimistically
// when the user takes actions (read message, activate account, etc.).
//
// This is NOT persisted — counts are always re-fetched fresh on login.
// Using a store (not local hook state) means all navbars and pages always
// show the same number regardless of which page is currently mounted.

export const useNotificationStore = create<NotificationState & NotificationActions>((set) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  messagesNonLus: 3,
  comptesEnAttente: 2,
  dossiersEnAttente: 0,
  csdMessagesNonLus: 0,
  isLoaded: false,

  // ── Bulk setters — called after fetch ──────────────────────────────────────
  setDirectriceCounts: (counts) =>
    set({ ...counts, isLoaded: true }),

  setCSDCounts: (counts) =>
    set({ ...counts, isLoaded: true }),

  // ── Optimistic decrements — called when user takes action ─────────────────
  // These keep the badge accurate immediately without waiting for a re-fetch.

  decrementMessages: () =>
    set((state) => ({
      messagesNonLus: Math.max(0, state.messagesNonLus - 1),
    })),

  decrementCSDMessages: () =>
    set((state) => ({
      csdMessagesNonLus: Math.max(0, state.csdMessagesNonLus - 1),
    })),

  clearComptesEnAttente: () =>
    set({ comptesEnAttente: 0 }),
}))
