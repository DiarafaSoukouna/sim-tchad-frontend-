'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { formFields } from './form'
import { SecteurType } from './types'
import {
  getSecteurs,
  createSecteur,
  updateSecteur,
  deleteSecteur,
} from '@/functions/secteurs'
import { get } from 'http'

export default function SecteursPage() {
  const [secteurs, setSecteurs] = useState<SecteurType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SecteurType | null>(null)
  const [formValues, setFormValues] = useState<SecteurType>({} as SecteurType)

  const columns = [
    { key: 'code' as const, label: 'Code' },
    { key: 'name' as const, label: 'Nom' },
    { key: 'description' as const, label: 'Description' },
  ]
  const handleFetch = async () => {
    try {
      const data = await getSecteurs()
      setSecteurs(data)
    } catch (error) {
      throw new Error('Fetch error')
    }
  }
  useEffect(() => {
    handleFetch()
  }, [])
  const handleAdd = () => {
    setEditingItem(null)
    setFormValues({} as SecteurType)
    setIsModalOpen(true)
  }

  const handleEdit = (item: SecteurType) => {
    setEditingItem(item)
    setFormValues({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      code: item.code,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (item: SecteurType) => {
    try {
      await deleteSecteur(item.id)
      handleFetch()
    } catch (error) {
      throw new Error('Delete error')
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateSecteur(formValues!)
        handleFetch()
      } else {
        await createSecteur(formValues!)
        handleFetch()
      }
      setIsModalOpen(false)
      setFormValues({} as SecteurType)
    } catch (error) {
      throw new Error('Submit error')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <PageHeader
          title="Secteurs"
          description="Gérez les secteurs d'activité"
          onAdd={handleAdd}
          addLabel="Ajouter un secteur"
        />
        <DataTable
          data={secteurs}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <FormModal
          size="lg"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="secteur"
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
