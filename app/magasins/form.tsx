import { getMagasins } from '@/functions/magasins'
import { FormField } from '@/lib/store'
import { useEffect, useState } from 'react'
import { MagasinTypes } from './types'
import { ActorType } from '../acteurs/types'
import { getActeurs } from '@/functions/acteurs'

export function useMagasinFormFields() { 
  const [acteurs, setActeurs] = useState<ActorType[]>([])
  
    useEffect(() => {
      async function fetchActeurs() {
        const data = await getActeurs()
        setActeurs(data)
      }
      fetchActeurs()
    }, [])
  
    const actorOptions = acteurs.map((a) => ({
      value: String(a.id),
      label: a.code + " "+ a.actor_sigle,
    }))
  const formFields: FormField[] = [
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    placeholder: 'Code du magasin',
    required: true,
    fullWidth: false,
  },
  {
    name: 'name',
    label: 'Nom',
    type: 'text',
    placeholder: 'Nom du magasin',
    required: true,
    fullWidth: false,
  },
  {
    name: 'phone',
    label: 'Telephone',
    type: 'text',
    placeholder: 'Telephone du magasin',
    required: true,
    fullWidth: false,
  },

  {
    name: 'whatsapp',
    label: 'Whatsapp',
    type: 'text',
    placeholder: 'Whatsapp du magasin',
    required: true,
    fullWidth: false,
  },
  {
    name: 'address',
    label: 'Adresse',
    type: 'text',
    placeholder: 'Adresse du magasin',
    fullWidth: false,
  },
  {
    name: 'actor_id',
    label: 'Acteur',
    type: 'select',
      options: actorOptions,
      required:true,
    fullWidth: false,
  },
  {
    name: 'latitude',
    label: 'Latitude',
    type: 'text',
    placeholder: 'Latitude du magasin',
    required: true,
    fullWidth: false,
  },
  {
    name: 'longitude',
    label: 'Longitude',
    type: 'text',
    placeholder: 'Longitude du magasin',
    required: true,
    fullWidth: false,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Description du magasin',
    fullWidth: true,
  },
]

  return { formFields, acteurs }
}

