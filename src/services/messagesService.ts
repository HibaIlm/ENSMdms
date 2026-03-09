// ── Types ─────────────────────────────────────────────────────────────────────

export interface MembreCSDContact {
  id: string
  nom: string
  prenom: string
  email: string
  departement: string
  role: 'consultation' | 'validation'
  isOnline: boolean
}

export interface Message {
  id: string
  senderId: string
  senderNom: string
  senderRole: 'directrice' | 'csd'
  content: string
  timestamp: string
  dossierId?: string
  dossierTitre?: string
  isRead: boolean
}

export interface Conversation {
  membreId: string
  membre: MembreCSDContact
  messages: Message[]
  lastMessage: Message | null
  unreadCount: number
}

export interface SendMessagePayload {
  toMembreId: string
  content: string
  dossierId?: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_MEMBRES: MembreCSDContact[] = [
  {
    id: 'csd-1',
    nom: 'Khelil',
    prenom: 'Amine',
    email: 'a.khelil@ensmanagement.edu.dz',
    departement: 'Département Management et Entrepreneuriat',
    role: 'validation',
    isOnline: true,
  },
  {
    id: 'csd-2',
    nom: 'Boukhalfa',
    prenom: 'Sara',
    email: 's.boukhalfa@ensmanagement.edu.dz',
    departement: 'Département Management et Entrepreneuriat',
    role: 'consultation',
    isOnline: false,
  },
  {
    id: 'csd-3',
    nom: 'Mansouri',
    prenom: 'Yacine',
    email: 'y.mansouri@ensmanagement.edu.dz',
    departement: 'Département Management et Entrepreneuriat',
    role: 'validation',
    isOnline: true,
  },
  {
    id: 'csd-4',
    nom: 'Zerrouk',
    prenom: 'Lina',
    email: 'l.zerrouk@ensmanagement.edu.dz',
    departement: 'Département Management et Entrepreneuriat',
    role: 'consultation',
    isOnline: false,
  },
]

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    membreId: 'csd-1',
    membre: MOCK_MEMBRES[0],
    unreadCount: 2,
    lastMessage: {
      id: 'msg-4',
      senderId: 'csd-1',
      senderNom: 'Khelil',
      senderRole: 'csd',
      content: "J'ai bien reçu le dossier, je vais l'examiner cette semaine.",
      timestamp: '2025-03-09T10:32:00',
      isRead: false,
    },
    messages: [
      {
        id: 'msg-1',
        senderId: 'directrice',
        senderNom: 'Directrice',
        senderRole: 'directrice',
        content: 'Bonjour Dr. Khelil, pouvez-vous examiner le dossier de M. Meziane en priorité ?',
        timestamp: '2025-03-08T09:00:00',
        dossierId: 'D-2025-002',
        dossierTitre: 'Algorithmes de tri avancés',
        isRead: true,
      },
      {
        id: 'msg-2',
        senderId: 'csd-1',
        senderNom: 'Khelil',
        senderRole: 'csd',
        content: 'Bonjour Directrice, bien sûr. Je m\'en occupe dès demain matin.',
        timestamp: '2025-03-08T11:15:00',
        isRead: true,
      },
      {
        id: 'msg-3',
        senderId: 'directrice',
        senderNom: 'Directrice',
        senderRole: 'directrice',
        content: 'Merci, c\'est urgent. N\'oubliez pas d\'ajouter vos commentaires détaillés.',
        timestamp: '2025-03-08T14:00:00',
        isRead: true,
      },
      {
        id: 'msg-4',
        senderId: 'csd-1',
        senderNom: 'Khelil',
        senderRole: 'csd',
        content: "J'ai bien reçu le dossier, je vais l'examiner cette semaine.",
        timestamp: '2025-03-09T10:32:00',
        isRead: false,
      },
    ],
  },
  {
    membreId: 'csd-2',
    membre: MOCK_MEMBRES[1],
    unreadCount: 0,
    lastMessage: {
      id: 'msg-6',
      senderId: 'directrice',
      senderNom: 'Directrice',
      senderRole: 'directrice',
      content: 'Merci pour votre retour rapide.',
      timestamp: '2025-03-07T16:00:00',
      isRead: true,
    },
    messages: [
      {
        id: 'msg-5',
        senderId: 'csd-2',
        senderNom: 'Boukhalfa',
        senderRole: 'csd',
        content: 'Directrice, j\'ai consulté les deux dossiers du département. Tout est conforme.',
        timestamp: '2025-03-07T15:30:00',
        isRead: true,
      },
      {
        id: 'msg-6',
        senderId: 'directrice',
        senderNom: 'Directrice',
        senderRole: 'directrice',
        content: 'Merci pour votre retour rapide.',
        timestamp: '2025-03-07T16:00:00',
        isRead: true,
      },
    ],
  },
  {
    membreId: 'csd-3',
    membre: MOCK_MEMBRES[2],
    unreadCount: 1,
    lastMessage: {
      id: 'msg-8',
      senderId: 'csd-3',
      senderNom: 'Mansouri',
      senderRole: 'csd',
      content: 'Le dossier présente quelques lacunes bibliographiques. Je vous prépare un rapport.',
      timestamp: '2025-03-09T08:15:00',
      isRead: false,
    },
    messages: [
      {
        id: 'msg-7',
        senderId: 'directrice',
        senderNom: 'Directrice',
        senderRole: 'directrice',
        content: 'Dr. Mansouri, avez-vous eu le temps d\'évaluer l\'ouvrage de Dr. Boudiaf ?',
        timestamp: '2025-03-08T17:00:00',
        dossierId: 'D-2025-003',
        dossierTitre: 'Analyse mathématique — Tome II',
        isRead: true,
      },
      {
        id: 'msg-8',
        senderId: 'csd-3',
        senderNom: 'Mansouri',
        senderRole: 'csd',
        content: 'Le dossier présente quelques lacunes bibliographiques. Je vous prépare un rapport.',
        timestamp: '2025-03-09T08:15:00',
        isRead: false,
      },
    ],
  },
  {
    membreId: 'csd-4',
    membre: MOCK_MEMBRES[3],
    unreadCount: 0,
    lastMessage: null,
    messages: [],
  },
]

// ── Service ───────────────────────────────────────────────────────────────────

export const messagesService = {

  /**
   * Fetch all conversations for the Directrice.
   * Backend endpoint: GET /messages/conversations
   */
  getConversations: async (): Promise<Conversation[]> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 500))
    return MOCK_CONVERSATIONS
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<Conversation[]>('/messages/conversations')
    // return response.data
  },

  /**
   * Mark all messages in a conversation as read.
   * Backend endpoint: PATCH /messages/conversations/:membreId/read
   */
  markAsRead: async (membreId: string): Promise<void> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    console.log('Mark as read:', membreId)
    return
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // await api.patch(`/messages/conversations/${membreId}/read`)
  },

  /**
   * Send a message to a CSD member.
   * Backend endpoint: POST /messages
   */
  sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 400))
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'directrice',
      senderNom: 'Directrice',
      senderRole: 'directrice',
      content: payload.content,
      timestamp: new Date().toISOString(),
      dossierId: payload.dossierId,
      isRead: true,
    }
    return newMessage
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.post<Message>('/messages', payload)
    // return response.data
  },
}
