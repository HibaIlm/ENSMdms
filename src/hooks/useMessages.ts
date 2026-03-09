import { useState, useEffect, useRef } from 'react'
import {
  messagesService,
  type Conversation,
} from '../services/messagesService'

// ── Types ─────────────────────────────────────────────────────────────────────

interface UseMessagesState {
  conversations: Conversation[]
  activeConversation: Conversation | null
  search: string
  isLoading: boolean
  isSending: boolean
  error: string | null
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMessages() {
  const [state, setState] = useState<UseMessagesState>({
    conversations: [],
    activeConversation: null,
    search: '',
    isLoading: true,
    isSending: false,
    error: null,
  })

  // Ref to track active conversation id for marking as read without re-renders
  const activeIdRef = useRef<string | null>(null)

  // ── Fetch conversations ───────────────────────────────────────────────────

  async function fetchConversations() {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const conversations = await messagesService.getConversations()
      setState((prev) => ({
        ...prev,
        conversations,
        isLoading: false,
        // Keep active conversation in sync if already selected
        activeConversation: activeIdRef.current
          ? conversations.find((c) => c.membreId === activeIdRef.current) ?? null
          : null,
      }))
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Impossible de charger les messages. Veuillez réessayer.',
      }))
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  // ── Select conversation ───────────────────────────────────────────────────

  async function selectConversation(membreId: string) {
    const conversation = state.conversations.find((c) => c.membreId === membreId)
    if (!conversation) return

    activeIdRef.current = membreId
    setState((prev) => ({ ...prev, activeConversation: conversation }))

    // Mark as read if there are unread messages
    if (conversation.unreadCount > 0) {
      await messagesService.markAsRead(membreId)
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.membreId === membreId
            ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, isRead: true })) }
            : c
        ),
        activeConversation:
          prev.activeConversation?.membreId === membreId
            ? {
                ...prev.activeConversation,
                unreadCount: 0,
                messages: prev.activeConversation.messages.map((m) => ({ ...m, isRead: true })),
              }
            : prev.activeConversation,
      }))
    }
  }

  // ── Send message ──────────────────────────────────────────────────────────

  async function sendMessage(content: string, dossierId?: string) {
    const membreId = activeIdRef.current
    if (!membreId || !content.trim()) return

    setState((prev) => ({ ...prev, isSending: true }))

    try {
      const newMessage = await messagesService.sendMessage({
        toMembreId: membreId,
        content: content.trim(),
        dossierId,
      })

      setState((prev) => ({
        ...prev,
        isSending: false,
        conversations: prev.conversations.map((c) =>
          c.membreId === membreId
            ? { ...c, messages: [...c.messages, newMessage], lastMessage: newMessage }
            : c
        ),
        activeConversation:
          prev.activeConversation?.membreId === membreId
            ? {
                ...prev.activeConversation,
                messages: [...prev.activeConversation.messages, newMessage],
                lastMessage: newMessage,
              }
            : prev.activeConversation,
      }))
    } catch {
      setState((prev) => ({ ...prev, isSending: false }))
    }
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  const totalUnread = state.conversations.reduce((acc, c) => acc + c.unreadCount, 0)

  // ── Search filter ─────────────────────────────────────────────────────────
  // Applied here so no component needs to re-implement filtering logic.
  const filteredConversations = state.search.trim()
    ? state.conversations.filter((c) => {
        const fullName = `${c.membre.prenom} ${c.membre.nom}`.toLowerCase()
        return fullName.includes(state.search.toLowerCase())
      })
    : state.conversations

  function setSearch(search: string) {
    setState((prev) => ({ ...prev, search }))
  }

  return {
    ...state,
    conversations: filteredConversations,
    totalUnread,
    selectConversation,
    sendMessage,
    setSearch,
    refresh: fetchConversations,
  }
}