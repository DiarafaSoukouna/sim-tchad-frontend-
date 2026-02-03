import { useEffect, useState } from 'react'
import { getActeurs } from '@/functions/acteurs'
import { ActorType } from '@/app/acteurs/types'

export function useZoneProductionFormFields() {
  const [acteurs, setActeurs] = useState<ActorType[]>([])
  const [actorOptions, setActorOptions] = useState<
    { value: string; label: string }[]
  >([])

  useEffect(() => {
    async function fetchActeurs() {
      const data = await getActeurs()
      setActeurs(data)
      const options = data.map((actor) => ({
        value: actor.id.toString(),
        label: actor.actor,
      }))
      setActorOptions(options)
    }
    fetchActeurs()
  }, [])

  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      placeholder: 'Name',
      required: true,
    },
    {
      name: 'code',
      label: 'Code',
      type: 'text' as const,
      placeholder: 'Code',
      required: true,
    },

    {
      name: 'photo',
      label: 'Photo',
      type: 'text' as const,
      placeholder: 'URL de la photo',
    },
    {
      name: 'latitude',
      label: 'Latitude',
      type: 'text' as const,
      placeholder: 'Latitude',
    },
    {
      name: 'longitude',
      label: 'Longitude',
      type: 'text' as const,
      placeholder: 'Longitude',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text' as const,
      placeholder: 'Address',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Description',
      fullWidth: true,
    },
    {
      name: 'actor_id',
      label: 'Acteur',
      type: 'select' as const,
      options: actorOptions,
      required: true,
    },
  ]

  return { formFields, acteurs }
}
