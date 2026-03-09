import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send, Search, MessageSquare, FolderOpen,
  CheckCircle2, Eye, Circle, X, Loader2,
  AlertCircle, RefreshCw, ChevronLeft, Clock,
} from 'lucide-react'
import NavbarDirectrice from '../../components/NavbarDirectrice'
import { useMessages } from '../../hooks/useMessages'
import { useAuth } from '../../hooks/useAuth'
import { formatMessageTime, getDateSeparatorLabel, isDifferentDay } from '../../utils/dateUtils'
import type { Conversation, Message } from '../../services/messagesService'

// ── Component ─────────────────────────────────────────────────────────────────

export default function DirectriceMessages() {
  const navigate = useNavigate()
  const { fullName } = useAuth()

  const {
    conversations,
    activeConversation,
    search,
    isLoading,
    isSending,
    error,
    totalUnread,
    selectConversation,
    sendMessage,
    setSearch,
    refresh,
  } = useMessages()

  const [mobileShowThread, setMobileShowThread] = useState(false)

  function handleSelectConversation(membreId: string) {
    selectConversation(membreId)
    setMobileShowThread(true)
  }

  function handleBack() {
    setMobileShowThread(false)
  }

  if (isLoading) return <LoadingScreen />
  if (error) return <ErrorScreen message={error} onRetry={refresh} />

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      <NavbarDirectrice
        nomDirectrice={fullName}
        messagesNonLus={totalUnread}
        onLogout={() => navigate('/login')}
        onSwitchToEnseignante={() => navigate('/ens/dashboard')}
      />

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-5 min-h-0">

        {/* ── Sidebar — conversation list ── */}
        <aside
          className={`
            w-full sm:w-80 shrink-0 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
            ${mobileShowThread ? 'hidden sm:flex' : 'flex'}
          `}
        >
          <SidebarHeader totalUnread={totalUnread} search={search} onSearch={setSearch} />
          <ConversationList
            conversations={conversations}
            activeId={activeConversation?.membreId ?? null}
            onSelect={handleSelectConversation}
          />
        </aside>

        {/* ── Main — message thread ── */}
        <main
          className={`
            flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-0
            ${!mobileShowThread ? 'hidden sm:flex' : 'flex'}
          `}
        >
          {activeConversation ? (
            <MessageThread
              conversation={activeConversation}
              isSending={isSending}
              onSend={sendMessage}
              onBack={handleBack}
            />
          ) : (
            <EmptyThread />
          )}
        </main>

      </div>
    </div>
  )
}

// ── Sidebar Header ────────────────────────────────────────────────────────────

function SidebarHeader({
  totalUnread,
  search,
  onSearch,
}: {
  totalUnread: number
  search: string
  onSearch: (v: string) => void
}) {
  return (
    <div className="p-4 border-b border-gray-100 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-800 text-lg">Messages</h2>
        {totalUnread > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white bg-directrice">
            {totalUnread} non lu{totalUnread > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          type="text"
          placeholder="Rechercher un membre..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-directrice focus:ring-2 focus:ring-directrice/10 focus:bg-white transition-all"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Conversation List ─────────────────────────────────────────────────────────

function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.membreId}
          conversation={conv}
          isActive={conv.membreId === activeId}
          onClick={() => onSelect(conv.membreId)}
        />
      ))}
    </div>
  )
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}) {
  const { membre, lastMessage, unreadCount } = conversation
  const hasUnread = unreadCount > 0
  const RoleIcon = membre.role === 'validation' ? CheckCircle2 : Eye

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-150 ${
        isActive ? 'bg-directrice/5 border-l-2 border-directrice' : 'hover:bg-gray-50 border-l-2 border-transparent'
      }`}
    >
      {/* Avatar with online dot */}
      <div className="relative shrink-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
            isActive ? 'bg-directrice text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {membre.prenom.charAt(0)}{membre.nom.charAt(0)}
        </div>
        {membre.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-status-accepte border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm truncate ${hasUnread ? 'font-bold text-gray-800' : 'font-medium text-gray-700'}`}>
            {membre.prenom} {membre.nom}
          </span>
          {lastMessage && (
            <span className="text-[10px] text-gray-300 shrink-0">
              {formatMessageTime(lastMessage.timestamp)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-1">
          <RoleIcon size={10} className={membre.role === 'validation' ? 'text-status-accepte' : 'text-gray-300'} />
          <span className="text-[10px] text-gray-400 truncate">{membre.departement}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs truncate ${hasUnread ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
            {lastMessage
              ? (lastMessage.senderRole === 'directrice' ? 'Vous : ' : '') + lastMessage.content
              : 'Aucun message — démarrez la conversation'
            }
          </p>
          {hasUnread && (
            <span className="shrink-0 text-[10px] font-bold text-white bg-directrice rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// ── Message Thread ────────────────────────────────────────────────────────────

function MessageThread({
  conversation,
  isSending,
  onSend,
  onBack,
}: {
  conversation: Conversation
  isSending: boolean
  onSend: (content: string, dossierId?: string) => void
  onBack: () => void
}) {
  const { membre, messages } = conversation
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!text.trim() || isSending) return
    onSend(text)
    setText('')
    textareaRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const RoleIcon = membre.role === 'validation' ? CheckCircle2 : Eye

  return (
    <>
      {/* Thread header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
        <button
          onClick={onBack}
          className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>

        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-directrice flex items-center justify-center text-white text-sm font-bold">
            {membre.prenom.charAt(0)}{membre.nom.charAt(0)}
          </div>
          {membre.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-status-accepte border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">
            {membre.prenom} {membre.nom}
          </p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <RoleIcon size={10} />
              {membre.role === 'validation' ? 'Validation' : 'Consultation'}
            </span>
            <span className="text-gray-200">·</span>
            <span className="text-[10px] text-gray-400">{membre.departement}</span>
            <span className="text-gray-200">·</span>
            <span className={`text-[10px] font-medium flex items-center gap-1 ${membre.isOnline ? 'text-status-accepte' : 'text-gray-300'}`}>
              <Circle size={6} fill="currentColor" />
              {membre.isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-directrice/10 flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-directrice" />
            </div>
            <p className="font-semibold text-gray-600 text-sm mb-1">Démarrez la conversation</p>
            <p className="text-xs text-gray-400">
              Envoyez un message à {membre.prenom} {membre.nom}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                showDateSeparator={
                  i === 0 ||
                  isDifferentDay(messages[i - 1].timestamp, msg.timestamp)
                }
                previousTimestamp={i > 0 ? messages[i - 1].timestamp : null}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Compose area */}
      <div className="px-5 py-4 border-t border-gray-100 shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message à ${membre.prenom}... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)`}
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-directrice focus:ring-2 focus:ring-directrice/10 focus:bg-white transition-all resize-none leading-relaxed"
              style={{ maxHeight: '120px', overflowY: 'auto' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim() || isSending}
            className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 bg-directrice"
          >
            {isSending
              ? <Loader2 size={16} className="animate-spin" />
              : <Send size={16} />
            }
          </button>
        </div>
        <p className="text-[10px] text-gray-300 mt-2 text-center">
          Les membres CSD peuvent répondre mais ne peuvent pas initier une conversation.
        </p>
      </div>
    </>
  )
}

// ── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  showDateSeparator,
  previousTimestamp,
}: {
  message: Message
  showDateSeparator: boolean
  previousTimestamp: string | null
}) {
  const isMe = message.senderRole === 'directrice'

  return (
    <>
      {showDateSeparator && (
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] text-gray-300 font-medium shrink-0">
            {getDateSeparatorLabel(message.timestamp)}
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
      )}

      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>

          {/* Dossier link if attached */}
          {message.dossierId && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                isMe
                  ? 'bg-directrice/5 border-directrice/20 text-directrice'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <FolderOpen size={12} />
              <span className="truncate max-w-[200px]">{message.dossierTitre}</span>
            </div>
          )}

          {/* Bubble */}
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isMe
                ? 'bg-directrice text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}
          >
            {message.content}
          </div>

          {/* Timestamp */}
          <div className={`flex items-center gap-1 ${isMe ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] text-gray-300">
              {formatMessageTime(message.timestamp)}
            </span>
            {isMe && (
              message.isRead
                ? <CheckCircle2 size={10} className="text-directrice/40" />
                : <Clock size={10} className="text-gray-300" />
            )}
          </div>

        </div>
      </div>
    </>
  )
}

// ── Empty Thread ──────────────────────────────────────────────────────────────

function EmptyThread() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-directrice/10 flex items-center justify-center mb-4">
        <MessageSquare size={28} className="text-directrice" />
      </div>
      <p className="font-semibold text-gray-700 mb-2">Sélectionnez une conversation</p>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        Choisissez un membre du CSD dans la liste pour afficher vos échanges ou démarrer une nouvelle conversation.
      </p>
    </div>
  )
}

// ── Loading & Error screens ───────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-directrice animate-spin" />
        <p className="text-sm text-gray-400">Chargement des messages...</p>
      </div>
    </div>
  )
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <p className="font-semibold text-gray-700 mb-1">Erreur de chargement</p>
        <p className="text-sm text-gray-400 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold bg-directrice hover:opacity-90 transition-opacity mx-auto"
        >
          <RefreshCw size={14} />
          Réessayer
        </button>
      </div>
    </div>
  )
}