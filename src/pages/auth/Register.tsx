import { useNavigate, Link } from 'react-router-dom'
import {
  GraduationCap,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  BookOpen,
  Building2,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { useRegister } from '../../hooks/useRegister'
import { getPasswordStrength, GRADES, DEPARTEMENTS } from '../../services/authService'

// ── Component ─────────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    form,
    errors,
    isLoading,
    isSubmitted,
    serverError,
    handleChange,
    handleSubmit,
  } = useRegister()

  const passwordStrength = getPasswordStrength(form.motDePasse)

  if (isSubmitted) return <SuccessScreen onGoToLogin={() => navigate('/login')} />

  return (
    <div className="min-h-screen flex bg-page-enseignant">
      <LeftPanel />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-enseignant flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <p className="font-bold text-gray-800">Direction Doctorale</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Créer un compte</h2>
          <p className="text-gray-400 text-sm mb-8">
            Tous les champs marqués <span className="text-red-500">*</span> sont obligatoires.
          </p>

          {serverError && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <div className="space-y-6">

            <FormSection title="Informations personnelles">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Nom" required error={errors.nom} icon={<User size={15} className="text-gray-400" />}>
                  <input name="nom" type="text" placeholder="Votre nom de famille" value={form.nom} onChange={handleChange} className={inputClass(!!errors.nom)} />
                </FormField>
                <FormField label="Prénom" required error={errors.prenom} icon={<User size={15} className="text-gray-400" />}>
                  <input name="prenom" type="text" placeholder="Votre prénom" value={form.prenom} onChange={handleChange} className={inputClass(!!errors.prenom)} />
                </FormField>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Grade" required error={errors.grade} icon={<GraduationCap size={15} className="text-gray-400" />}>
                  <SelectField name="grade" value={form.grade} onChange={handleChange} hasError={!!errors.grade} placeholder="Sélectionner un grade" options={GRADES.map((g) => ({ value: g, label: g }))} />
                </FormField>
                <FormField label="Département" required error={errors.departement} icon={<Building2 size={15} className="text-gray-400" />}>
                  <SelectField name="departement" value={form.departement} onChange={handleChange} hasError={!!errors.departement} placeholder="Sélectionner un département" options={DEPARTEMENTS.map((d) => ({ value: d, label: d }))} />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Coordonnées">
              <FormField label="E-mail universitaire" required error={errors.email} hint="Doit appartenir au domaine universitaire (ex. @univ-alger.dz)" icon={<Mail size={15} className="text-gray-400" />}>
                <input name="email" type="email" placeholder="prenom.nom@univ-alger.dz" value={form.email} onChange={handleChange} className={inputClass(!!errors.email)} />
              </FormField>
              <FormField label="Téléphone" error={errors.telephone} hint="Optionnel" icon={<Phone size={15} className="text-gray-400" />}>
                <input name="telephone" type="tel" placeholder="0555 00 00 00" value={form.telephone} onChange={handleChange} className={inputClass(!!errors.telephone)} />
              </FormField>
              <FormField label="Spécialité" hint="Optionnel — domaine d'enseignement ou de recherche" icon={<BookOpen size={15} className="text-gray-400" />}>
                <input name="specialite" type="text" placeholder="Ex. Intelligence Artificielle, Algèbre..." value={form.specialite} onChange={handleChange} className={inputClass(false)} />
              </FormField>
            </FormSection>

            <FormSection title="Sécurité">
              <FormField label="Mot de passe" required error={errors.motDePasse}>
                <div className="relative">
                  <input name="motDePasse" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 caractères" value={form.motDePasse} onChange={handleChange} className={inputClass(!!errors.motDePasse) + ' pr-10'} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {form.motDePasse && <PasswordStrengthIndicator password={form.motDePasse} strength={passwordStrength} />}
              </FormField>

              <FormField label="Confirmer le mot de passe" required error={errors.confirmMotDePasse}>
                <div className="relative">
                  <input name="confirmMotDePasse" type={showConfirm ? 'text' : 'password'} placeholder="Répétez votre mot de passe" value={form.confirmMotDePasse} onChange={handleChange} className={inputClass(!!errors.confirmMotDePasse) + ' pr-10'} />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>
            </FormSection>

            <button onClick={handleSubmit} disabled={isLoading} className="w-full py-3.5 rounded-xl text-white font-semibold text-sm bg-enseignant hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Création en cours...</> : 'Créer mon compte'}
            </button>

            <p className="text-center text-sm text-gray-400">
              Déjà inscrit ?{' '}
              <Link to="/login" className="font-semibold text-enseignant hover:underline">Se connecter</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Left Panel ────────────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-96 shrink-0 p-10 text-white bg-enseignant">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">Direction Doctorale</p>
            <p className="text-white/60 text-xs">Plateforme de Gestion</p>
          </div>
        </div>
        <h1 className="text-3xl font-bold leading-tight mb-4">Rejoignez la plateforme</h1>
        <p className="text-white/70 text-sm leading-relaxed">
          Créez votre compte enseignant pour soumettre vos documents pédagogiques et suivre leur évaluation par le Comité Scientifique.
        </p>
        <div className="mt-10 space-y-4">
          {[
            { icon: BookOpen, text: 'Soumettez cours, publications et ouvrages' },
            { icon: CheckCircle2, text: 'Suivez le statut de vos dossiers en temps réel' },
            { icon: Mail, text: 'Recevez les décisions directement sur la plateforme' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-white" />
              </div>
              <p className="text-white/80 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-white/40 text-xs">© 2025 Direction Doctorale — Usage interne exclusif</p>
    </div>
  )
}

// ── Success Screen ────────────────────────────────────────────────────────────

function SuccessScreen({ onGoToLogin }: { onGoToLogin: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-page-enseignant">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-enseignant/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-enseignant" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Compte créé !</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Votre compte est actuellement{' '}
          <span className="font-semibold text-status-evaluation">en attente d'activation</span>{' '}
          par la Directrice.
        </p>
        <button onClick={onGoToLogin} className="w-full py-3 rounded-xl text-white font-semibold text-sm bg-enseignant hover:opacity-90 transition-opacity">
          Retour à la connexion
        </button>
      </div>
    </div>
  )
}

// ── Password Strength ─────────────────────────────────────────────────────────

function PasswordStrengthIndicator({ password, strength }: { password: string; strength: { score: number; label: string; color: string } }) {
  const rules = [
    { met: password.length >= 8, label: 'Au moins 8 caractères' },
    { met: /[A-Z]/.test(password), label: 'Une lettre majuscule' },
    { met: /[0-9]/.test(password), label: 'Un chiffre' },
  ]
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: i <= strength.score ? strength.color : 'var(--color-border-default)' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: strength.color }}>Force : {strength.label}</p>
      <div className="space-y-1">
        {rules.map(({ met, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: met ? 'var(--color-status-accepte)' : 'var(--color-border-default)' }}>
              {met && <CheckCircle2 size={8} className="text-white" />}
            </div>
            <span className={`text-xs ${met ? 'text-status-accepte' : 'text-gray-400'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Shared Form Components ────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-3">{title}</h3>
      {children}
    </div>
  )
}

function FormField({ label, required, error, hint, icon, children }: { label: string; required?: boolean; error?: string; hint?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {icon}{label}{required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && (
        <div className="flex items-center gap-1.5">
          <AlertCircle size={12} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}
    </div>
  )
}

function SelectField({ name, value, onChange, hasError, placeholder, options }: { name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; hasError: boolean; placeholder: string; options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select name={name} value={value} onChange={onChange} className={selectClass(hasError)}>
        <option value="">{placeholder}</option>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}

function inputClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all duration-150 ${hasError ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-200 bg-gray-50 focus:border-enseignant focus:ring-2 focus:ring-enseignant/10 focus:bg-white'}`
}

function selectClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-lg border text-sm outline-none appearance-none transition-all duration-150 ${hasError ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-200 bg-gray-50 focus:border-enseignant focus:ring-2 focus:ring-enseignant/10 focus:bg-white'}`
}