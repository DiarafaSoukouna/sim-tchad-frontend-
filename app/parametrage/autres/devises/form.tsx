import { FormField } from '@/lib/store'
export const currencyFields: FormField[] = [
  {
    name: 'name',
    label: 'Nom',
    type: 'text',
    placeholder: 'Franc CFA',
    required: true,
  },
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    placeholder: 'XAF',
    required: true,
  },
  {
    name: 'symbol',
    label: 'Symbole',
    type: 'text',
    placeholder: 'FCFA',
    required: true,
  },
]
