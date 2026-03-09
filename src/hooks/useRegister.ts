import { useState } from 'react'
import {
  authService,
  isValidUniversityEmail,
  type RegisterPayload,
} from '../services/authService'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RegisterForm {
  nom: string
  prenom: string
  grade: string
  departement: string
  email: string
  motDePasse: string
  confirmMotDePasse: string
  telephone: string
  specialite: string
}

export type FieldErrors = Partial<Record<keyof RegisterForm, string>>

const INITIAL_FORM: RegisterForm = {
  nom: '',
  prenom: '',
  grade: '',
  departement: '',
  email: '',
  motDePasse: '',
  confirmMotDePasse: '',
  telephone: '',
  specialite: '',
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRegister() {
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // ── Field handler ─────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name as keyof RegisterForm]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name as keyof RegisterForm]
        return next
      })
    }
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function validate(): boolean {
    const newErrors: FieldErrors = {}

    if (!form.nom.trim()) newErrors.nom = 'Le nom est obligatoire.'
    if (!form.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire.'
    if (!form.grade) newErrors.grade = 'Veuillez sélectionner un grade.'
    if (!form.departement) newErrors.departement = 'Veuillez sélectionner un département.'

    if (!form.email.trim()) {
      newErrors.email = "L'e-mail est obligatoire."
    } else if (!isValidUniversityEmail(form.email)) {
      newErrors.email = "L'e-mail doit appartenir au domaine universitaire (ex. @univ-alger.dz)."
    }

    if (!form.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est obligatoire.'
    } else if (form.motDePasse.length < 8) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères.'
    }

    if (!form.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Veuillez confirmer votre mot de passe.'
    } else if (form.motDePasse !== form.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas.'
    }

    if (form.telephone && !/^[0-9+\s()-]{8,15}$/.test(form.telephone)) {
      newErrors.telephone = 'Numéro de téléphone invalide.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setServerError(null)

    const payload: RegisterPayload = {
      nom: form.nom,
      prenom: form.prenom,
      grade: form.grade,
      departement: form.departement,
      email: form.email,
      motDePasse: form.motDePasse,
      telephone: form.telephone || undefined,
      specialite: form.specialite || undefined,
    }

    try {
      await authService.register(payload)
      setIsSubmitted(true)
    } catch {
      setServerError("Une erreur est survenue lors de la création du compte. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    errors,
    isLoading,
    isSubmitted,
    serverError,
    handleChange,
    handleSubmit,
  }
}
