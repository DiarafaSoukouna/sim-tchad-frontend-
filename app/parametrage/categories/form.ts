import { FormField } from '@/lib/store'
import { useState, useEffect } from 'react'
import { getSecteurs } from '@/functions/secteurs'
import { SecteurType } from '../secteurs/types'

export function useCategoryFormFields() {
  const [secteurs, setSecteurs] = useState<SecteurType[]>([])

  useEffect(() => {
    async function fetchSecteurs() {
      const data = await getSecteurs()
      setSecteurs(data)
    }
    fetchSecteurs()
  }, [])

  const sectorOptions = secteurs.map((s) => ({
    value: String(s.id),
    label: s.name,
  }))

  const formFields: FormField[] = [
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      placeholder: 'Code de la catégorie',
      fullWidth: true,
    },

    {
      name: 'name',
      label: 'Nom',
      type: 'text',
      placeholder: 'Nom de la catégorie',
      required: true,
      fullWidth: true,
    },
    {
      name: 'sector_id',
      label: 'Secteur',
      type: 'select',
      options: sectorOptions,
      required: true,
      fullWidth: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Description de la catégorie',
      fullWidth: true,
    },
  ]

  return { formFields, secteurs }
}
