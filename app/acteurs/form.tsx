import { FormField } from '@/lib/store'
import { useState, useEffect } from 'react'
import { getTypesActeurs } from '@/functions/typeActeurs'
import { TypeActeurTypes } from './typeActeurs/types'

export function useCategoryFormFields() {
  const [typesActeurs, setTypesActeurs] = useState<TypeActeurTypes[]>([])

  useEffect(() => {
    async function fetchTypesActeurs() {
      const data = await getTypesActeurs()
      setTypesActeurs(data)
    }
    fetchTypesActeurs()
  }, [])

  const formFields: FormField[] = [
    {
      name: 'actor',
      label: 'Nom de l’acteur',
      type: 'text',
      placeholder: "Nom complet de l'acteur",
      required: true,
      fullWidth: true,
    },
    {
      name: 'actor_sigle',
      label: 'Sigle',
      type: 'text',
      placeholder: "Sigle de l'acteur",
      required: true,
      fullWidth: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'email@exemple.com',
      required: true,
    },
    {
      name: 'phone',
      label: 'Téléphone',
      type: 'tel',
      placeholder: '+237 600 000 000',
      required: true,
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp',
      type: 'tel',
      placeholder: '+237 600 000 000',
    },
    {
      name: 'actor_type_id',
      label: "Type d'acteur",
      type: 'select',
      options: typesActeurs.map((t) => ({
        value: String(t.id),
        label: t.name,
      })),
      required: true,
    },
    {
      name: 'address',
      label: 'Adresse',
      type: 'text',
      placeholder: "Adresse de l'acteur",
      required: true,
    },
    {
      name: 'latitude',
      label: 'Latitude',
      type: 'text',
      placeholder: 'Latitude',
    },
    {
      name: 'longitude',
      label: 'Longitude',
      type: 'text',
      placeholder: 'Longitude',
    },
    {
      name: 'headquarter_photo',
      label: 'Photo du siège',
      type: 'file',
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'file',
    },
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      placeholder: 'Code acteur',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: "Description de l'acteur",
    },
    {
      name: 'password',
      label: 'Mot de passe',
      type: 'password',
      placeholder: 'Mot de passe',
      required: true,
      hiddenOnEdit: true,
    },
  ]

  return { formFields, typesActeurs }
}
