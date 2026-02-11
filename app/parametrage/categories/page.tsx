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
import Loading from '@/components/ui/Loading'
import { showError, showSuccess } from '@/components/ui/sweetAlert'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
      setIsLoading(true)
      await deleteCategory(item.id)
      handleFetch()
      setIsLoading(false)
      showSuccess('Catégorie supprimée avec succès')
    } catch (error) {
      showError('Erreur lors de la suppression de la catégorie')
      console.error('Error deleting category:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleFetch = async () => {
    try {
      setIsLoading(true)
      const data = await getCategories()
      if (data) {
        setCategories(data)
      }
      setIsLoading(true)
    } catch (error) {
      throw new Error('Fetch error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      if (editingItem) {
        await updateCategory(formValues!)
        handleFetch()
      } else {
        await createCategory(formValues!)
        handleFetch()
      }
      setIsModalOpen(false)
      setIsLoading(false)
      setFormValues({} as CategoryType)
      showSuccess(
        editingItem ? 'Catégorie mise à jour avec succès' :
          'Catégorie ajoutée avec succès')
    } catch (error) {
      showError('Erreur lors de la mise à jour de la catégorie')
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
        {isLoading ? (
          <Loading />
        ) :
          <DataTable
            data={categories}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />}
        <FormModal
          open={isModalOpen}
          loading={isLoading}
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
