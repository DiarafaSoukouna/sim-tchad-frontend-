'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { useSpeculationFormFields } from './form'
import { SpeculationType } from './types'
import {
  getSpeculations,
  createSpeculation,
  updateSpeculation,
  deleteSpeculation,
} from '@/functions/speculations'
import { getCategories } from '@/functions/categories'
import { CategoryType } from '../categories/types'

export default function SpeculationsPage() {
  const [speculations, setSpeculations] = useState<SpeculationType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SpeculationType | null>(null)
  const [formValues, setFormValues] = useState<SpeculationType>(
    {} as SpeculationType,
  )
  const { formFields, categories } = useSpeculationFormFields()

  const columns = [
    { key: 'code' as const, label: 'Code' },

    { key: 'name' as const, label: 'Nom' },
    {
      key: 'category_id' as const,
      label: 'Catégorie',
      render: (item: SpeculationType) => {
        const categorie = categories.find((c) => c.id === item.category_id)
        return categorie?.name || '-'
      },
    },
    { key: 'description' as const, label: 'Description' },
    {
      key: 'photo' as const,
      label: 'Photo',
      render: (item: SpeculationType) =>
        item.photo ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.photo}`}
            alt="speculation"
            className="h-10 w-10 object-cover rounded-md border"
          />
        ) : (
          '-'
        ),
    },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setFormValues({} as SpeculationType)
    setIsModalOpen(true)
  }

  const handleEdit = (item: SpeculationType) => {
    setEditingItem(item)
    setFormValues({
      id: item.id,
      name: item.name,
      category_id: item.category_id,
      description: item.description,
      code: item.code,
      photo: undefined, // ⚠️ do not set the existing path
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (item: SpeculationType) => {
    try {
      await deleteSpeculation(item.id)
      handleFetch()
    } catch (error) {
      console.error('Error deleting speculation:', error)
    }
  }
  const handleFetch = async () => {
    try {
      await getSpeculations().then((data) => setSpeculations(data))
    } catch (error) {
      console.error('Error fetching speculations:', error)
    }
  }

  useEffect(() => {
    handleFetch()
  }, [])
  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      Object.entries(formValues).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'string' || typeof value === 'number') {
          formData.append(key, String(value))
        }
      })

      if (editingItem) {
        await updateSpeculation(editingItem.id, formData)
      } else {
        await createSpeculation(formData)
      }

      await handleFetch()
      setIsModalOpen(false)
      setFormValues({} as SpeculationType)
      setEditingItem(null)
    } catch (error) {
      console.error('Error submitting speculation:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <PageHeader
          title="Spéculations"
          description="Gérez les spéculations agricoles"
          onAdd={handleAdd}
          addLabel="Ajouter une spéculation"
        />
        <DataTable
          data={speculations}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <FormModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="spéculation"
          fields={formFields}
          values={formValues}
          size="lg"
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
