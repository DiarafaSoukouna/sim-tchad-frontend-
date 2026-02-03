import { getCategories } from '@/functions/categories'
import { FormField } from '@/lib/store'
import { useEffect, useState } from 'react'
import { CategoryType } from '../categories/types'

export const useSpeculationFormFields = () => {
  const [categories, setCategories] = useState<CategoryType[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Erreur lors du chargement des catégories', err)
      }
    }
    fetchCategories()
  }, [])

  const formFields: FormField[] = [
    {
      name: 'name',
      label: 'Nom',
      type: 'text',
      placeholder: 'Nom de la spéculation',
      required: true,
      fullWidth: true,
    },
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      placeholder: 'Code de la spéculation',
      fullWidth: true,
    },
    {
      name: 'category_id',
      label: 'Catégorie',
      type: 'select',
      options: categories.map((c) => ({
        value: c.id.toString(),
        label: c.name,
      })),
      required: true,
      fullWidth: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Description de la spéculation',
      fullWidth: true,
    },
    {
      name: 'photo',
      label: 'Photo',
      type: 'file',
      placeholder: 'Photo de la spéculation',
      fullWidth: true,
    },
  ]

  return { formFields, categories }
}
