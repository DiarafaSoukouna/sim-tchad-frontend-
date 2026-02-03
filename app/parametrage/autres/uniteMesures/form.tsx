import { FormField } from '@/lib/store'

export const uniteFields: FormField[] = [
  {
    name: 'name',
    label: 'Nom',
    type: 'text',
    placeholder: 'Ex : Kilogramme',
    required: true,
  },
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    placeholder: 'kg',
    required: true,
  },
]
