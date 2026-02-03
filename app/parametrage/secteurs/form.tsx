import { FormField } from '@/lib/store'

export const formFields: FormField[] = [
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    placeholder: 'Code du secteur',
    fullWidth: true,
  },
  {
    name: 'name',
    label: 'Nom',
    type: 'text',
    placeholder: 'Nom du secteur',
    required: true,
    fullWidth: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Description du secteur',
    fullWidth: true,
  },
]
