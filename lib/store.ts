'use client'

// Simple state management with localStorage simulation
export interface Secteur {
  id: string
  nom: string
  description: string
  createdAt: string
}

export interface Categorie {
  id: string
  nom: string
  secteurId: string
  description: string
  createdAt: string
}

export interface Speculation {
  id: string
  nom: string
  categorieId: string
  description: string
  createdAt: string
}

export interface ZoneProduction {
  id: string
  nom: string
  region: string
  description: string
  createdAt: string
}

export interface UniteMesure {
  id: string
  nom: string
  symbole: string
}

export interface Currency {
  id: string
  nom: string
  code: string
  symbole: string
}

export interface Langue {
  id: string
  nom: string
  code: string
}

export interface TypeProduit {
  id: string
  nom: string
  description: string
}

export interface Produit {
  id: string
  nom: string
  typeId: string
  uniteMesureId: string
  description: string
  createdAt: string
}

export interface TypeActeur {
  id: string
  nom: string
  description: string
}

export interface Acteur {
  id: string
  nom: string
  typeId: string
  contact: string
  adresse: string
  createdAt: string
}

export interface UserProfile {
  nom: string
  email: string
  telephone: string
  organisation: string
  role: string
}

export interface AppSettings {
  langue: string
  devise: string
  theme: string
  notifications: boolean
}

// Initial data
export const initialSecteurs: Secteur[] = [
  {
    id: '1',
    nom: 'Agriculture',
    description: 'Secteur agricole',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    nom: 'Elevage',
    description: "Secteur de l'élevage",
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    nom: 'Pêche',
    description: 'Secteur de la pêche',
    createdAt: '2024-01-16',
  },
]

export const initialCategories: Categorie[] = [
  {
    id: '1',
    nom: 'Céréales',
    secteurId: '1',
    description: 'Produits céréaliers',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    nom: 'Légumineuses',
    secteurId: '1',
    description: 'Haricots, pois, etc.',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    nom: 'Bovins',
    secteurId: '2',
    description: 'Élevage bovin',
    createdAt: '2024-01-16',
  },
]

export const initialSpeculations: Speculation[] = [
  {
    id: '1',
    nom: 'Maïs',
    categorieId: '1',
    description: 'Culture du maïs',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    nom: 'Riz',
    categorieId: '1',
    description: 'Culture du riz',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    nom: 'Haricot rouge',
    categorieId: '2',
    description: 'Culture du haricot',
    createdAt: '2024-01-16',
  },
]

export const initialZones: ZoneProduction[] = [
  {
    id: '1',
    nom: 'Zone Nord',
    region: 'Nord',
    description: 'Zone de production nord',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    nom: 'Zone Sud',
    region: 'Sud',
    description: 'Zone de production sud',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    nom: 'Zone Est',
    region: 'Est',
    description: 'Zone de production est',
    createdAt: '2024-01-16',
  },
]

export const initialUnites: UniteMesure[] = [
  { id: '1', nom: 'Kilogramme', symbole: 'kg' },
  { id: '2', nom: 'Tonne', symbole: 't' },
  { id: '3', nom: 'Litre', symbole: 'L' },
  { id: '4', nom: 'Sac (100kg)', symbole: 'sac' },
]

export const initialCurrencies: Currency[] = [
  { id: '1', nom: 'Franc CFA', code: 'XAF', symbole: 'FCFA' },
  { id: '2', nom: 'Euro', code: 'EUR', symbole: '€' },
  { id: '3', nom: 'Dollar US', code: 'USD', symbole: '$' },
]

export const initialLangues: Langue[] = [
  { id: '1', nom: 'Français', code: 'fr' },
  { id: '2', nom: 'English', code: 'en' },
  { id: '3', nom: 'Español', code: 'es' },
]

export const initialTypesProduits: TypeProduit[] = [
  {
    id: '1',
    nom: 'Produit agricole',
    description: "Produits issus de l'agriculture",
  },
  { id: '2', nom: 'Produit transformé', description: 'Produits transformés' },
  { id: '3', nom: 'Intrant agricole', description: 'Engrais, semences, etc.' },
]

export const initialProduits: Produit[] = [
  {
    id: '1',
    nom: 'Maïs grain',
    typeId: '1',
    uniteMesureId: '1',
    description: 'Maïs en grain',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    nom: 'Farine de maïs',
    typeId: '2',
    uniteMesureId: '1',
    description: 'Farine de maïs',
    createdAt: '2024-01-16',
  },
]

export const initialTypesActeurs: TypeActeur[] = [
  { id: '1', nom: 'Producteur', description: 'Producteur agricole' },
  { id: '2', nom: 'Commerçant', description: 'Commerçant de produits' },
  { id: '3', nom: 'Transformateur', description: 'Transformateur de produits' },
]

export const initialActeurs: Acteur[] = [
  {
    id: '1',
    nom: 'Jean Dupont',
    typeId: '1',
    contact: '+237 600 000 001',
    adresse: 'Yaoundé',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    nom: 'Marie Kamga',
    typeId: '2',
    contact: '+237 600 000 002',
    adresse: 'Douala',
    createdAt: '2024-01-16',
  },
]

export const initialProfile: UserProfile = {
  nom: 'Admin SIM',
  email: 'admin@sim.gov',
  telephone: '+237 600 000 000',
  organisation: "Ministère de l'Agriculture",
  role: 'Administrateur',
}

export const initialSettings: AppSettings = {
  langue: 'fr',
  devise: 'XAF',
  theme: 'dark',
  notifications: true,
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
export interface FormField {
  name: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'email'
    | 'tel'
    | 'file'
    | 'password'
    | 'number'
    | 'date'
  placeholder?: string
  options?: { value: string; label: string }[]
  required?: boolean
  fullWidth?: boolean
  hiddenOnEdit?: boolean
}
