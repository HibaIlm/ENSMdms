import NavbarDirectrice from '../components/NavbarDirectrice'
import NavbarCSD from '../components/NavbarCSD'

export default function TestComponents() {
  return (
    <div>
      <h2 className="p-4 text-gray-500 text-sm">NavbarDirectrice</h2>
      <NavbarDirectrice
        nomDirectrice="Dr. Benali"
        messagesNonLus={3}
        comptesEnAttente={2}
      />

      <h2 className="p-4 mt-8 text-gray-500 text-sm">NavbarCSD — Validation</h2>
      <NavbarCSD
        nomMembre="Dr. Meziane"
        role="validation"
        departement="Département Informatique"
        messagesNonLus={1}
        dossiersNonTraites={4}
      />

      <h2 className="p-4 mt-8 text-gray-500 text-sm">NavbarCSD — Consultation</h2>
      <NavbarCSD
        nomMembre="Dr. Khelil"
        role="consultation"
        departement="Département Mathématiques"
      />
    </div>
  )
}