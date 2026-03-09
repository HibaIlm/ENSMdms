// ── Date utilities ────────────────────────────────────────────────────────────
// Pure functions — no side effects, no imports.
// Used by: Messages (Directrice), Messages (CSD), and any future page
// that displays timestamps or date separators in a conversation thread.

/**
 * Formats a timestamp for display in a message bubble.
 * - Today     → "14:32"
 * - Yesterday → "Hier"
 * - Older     → "05 mars"
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Hier'

  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

/**
 * Returns a human-readable date label for conversation date separators.
 * - Today     → "Aujourd'hui"
 * - Yesterday → "Hier"
 * - Older     → "lundi 3 mars"
 */
export function getDateSeparatorLabel(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()

  if (date.toDateString() === now.toDateString()) return "Aujourd'hui"

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Hier'

  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/**
 * Returns true if two timestamps belong to different calendar days.
 * Used to decide whether to insert a date separator between two messages.
 */
export function isDifferentDay(timestampA: string, timestampB: string): boolean {
  return new Date(timestampA).toDateString() !== new Date(timestampB).toDateString()
}
