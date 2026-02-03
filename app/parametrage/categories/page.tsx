'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { useCategoryFormFields } from './form'
import { CategoryType } from './types'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/functions/categories'

import {
  Categorie,
  initialCategories,
  initialSecteurs,
  generateId,
} from '@/lib/store'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CategoryType | null>(null)
  const [formValues, setFormValues] = useState<CategoryType>({} as CategoryType)
  const { formFields, secteurs } = useCategoryFormFields()

  const columns = [
    { key: 'code' as const, label: 'Code' },

    { key: 'name' as const, label: 'Nom' },
    {
      key: 'sector_id' as const,
      label: 'Secteur',
      render: (item: CategoryType) => {
        const secteur = secteurs.find((s) => s.id === item.sector_id)
        return secteur?.name || '-'
      },
    },
    { key: 'description' as const, label: 'Description' },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setFormValues({} as CategoryType)
    setIsModalOpen(true)
  }

  const handleEdit = (item: CategoryType) => {
    setEditingItem(item)
    setFormValues({
      id: item.id,
      name: item.name,
      sector_id: item.sector_id,
      description: item.description,
      code: item.code,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (item: CategoryType) => {
    try {
      await deleteCategory(item.id)
      handleFetch()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }
  const handleFetch = async () => {
    try {
      const data = await getCategories()
      if (data) {
        setCategories(data)
      }
    } catch (error) {
      throw new Error('Fetch error')
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateCategory(formValues!)
        handleFetch()
      } else {
        await createCategory(formValues!)
        handleFetch()
      }
      setIsModalOpen(false)
      setFormValues({} as CategoryType)
    } catch (error) {
      console.error('Error submitting category:', error)
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
          title="Catégories"
          description="Gérez les catégories de produits"
          onAdd={handleAdd}
          addLabel="Ajouter une catégorie"
        />
        <DataTable
          data={categories}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <FormModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="catégorie"
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
