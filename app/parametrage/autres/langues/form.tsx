import { FormField } from '@/lib/store'
export const langueFields: FormField[] = [
  {
    name: 'name',
    label: 'Nom',
    type: 'text',
    placeholder: 'Français',
    required: true,
  },
  {
    name: 'locale',
    label: 'Locale',
    type: 'text',
    placeholder: 'fr',
    required: true,
  },
]
