'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'

import { useZoneProductionFormFields } from './form'
import {
  getZoneProductions,
  createZoneProduction,
  updateZoneProduction,
} from '@/functions/zoneProduction'
import { ZoneProductionTypes } from './types'

export default function ZonesPage() {
  const [zones, setZones] = useState<ZoneProductionTypes[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ZoneProductionTypes | null>(
    null
  )
  const [formValues, setFormValues] = useState<ZoneProductionTypes>(
    {} as ZoneProductionTypes
  )

  const { formFields, acteurs } = useZoneProductionFormFields()

  const columns = [
    { key: 'code' as const, label: 'Code' },

    { key: 'name' as const, label: 'Nom' },
    {
      key: 'actor_id' as const,
      label: 'Acteur',
      render: (item: ZoneProductionTypes) => {
        const acteur = acteurs.find((a) => a.id === item.actor_id)
        return acteur ? acteur.actor : item.actor_id
      },
    },
    // { key: 'photo' as const, label: 'Photo' },
    { key: 'address' as const, label: 'Adresse' },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setFormValues({} as ZoneProductionTypes)
    setIsModalOpen(true)
  }

  const handleEdit = (item: ZoneProductionTypes) => {
    setEditingItem(item)
    setFormValues({
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description,
      actor_id: item.actor_id,
      photo: item.photo,
      latitude: item.latitude,
      longitude: item.longitude,
      address: item.address,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateZoneProduction(formValues)
        handleFetch()
      } else {
        const newZone = await createZoneProduction(formValues)
        handleFetch()
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    } finally {
      setIsModalOpen(false)
      setFormValues({} as ZoneProductionTypes)
      setEditingItem(null)
    }
  }

  const handleFetch = async () => {
    try {
      const data = await getZoneProductions()
      if (data) setZones(data)
    } catch (error) {
      console.error('Failed to fetch zones:', error)
    }
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <PageHeader
          title="Zones de Production"
          description="Gérez les zones de production agricole"
          onAdd={handleAdd}
          addLabel="Ajouter une zone"
        />
        <DataTable
          data={zones}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleEdit}
        />
        <FormModal
          size="xl"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="zone de production"
          fields={formFields}
          values={formValues}
          onChange={(name, value) =>
            setFormValues({ ...formValues, [name]: value })
          }
          onSubmit={handleSubmit}
          isEdit={!!editingItem}
        />
      </main>
    </div>
  )
}
