'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'

import { Button } from '@/components/ui/button'

import { FormModal } from '@/components/form-modal'

import { Settings2, Plus, Pencil, Trash2, Type, Folder } from 'lucide-react'
import { ProduitAttribute, ProduitType } from './types'
import TypeProduits from './typeProduits/page'
import { useCategoryFormFields } from './form'
import { getTypesProduits } from '@/functions/typeProduits'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TypeProduitTypes } from './typeProduits/types'
import {
  getProduits,
  createProduit,
  updateProduit,
  deleteProduit,
} from '@/functions/produits'

export default function ProduitsPage() {
  const [produits, setProduits] = useState<ProduitType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ProduitType | null>(null)
  const [editingType, setEditingType] = useState<TypeProduitTypes | null>(null)
  const [formValues, setFormValues] = useState<ProduitType>({} as ProduitType)
  const [typesProduits, setTypesProduits] = useState<TypeProduitTypes[]>([])
  const { formFields, typesProduitsAttributs, dynamicAttributes } =
    useCategoryFormFields(Number(formValues.product_type_id))

  const columns = [
    { key: 'code' as const, label: 'Code' },
    { key: 'name' as const, label: 'Nom du produit' },
    { key: 'description' as const, label: 'Description' },
    { key: 'quantity' as const, label: 'Quantité' },
    { key: 'price' as const, label: 'Prix unitaire (FCFA)' },
    {
      key: 'photo' as const,
      label: 'Photo',
      render: (item: ProduitType) =>
        item.photo ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.photo}`}
            alt={item.name}
            className="h-12 w-12 object-cover rounded-md border"
          />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
  ]
  useEffect(() => {
    if (!editingItem) return
    if (!dynamicAttributes.length) return

    console.log('Dynamic attributes READY:', dynamicAttributes)

    const data: Record<string, any> = {}

    dynamicAttributes.forEach((attr) => {
      const matched = editingItem.attributes?.find((a) => a.name === attr.name)

      if (matched) {
        data[attr.name] = matched.value
      }
    })

    setFormValues((prev) => ({
      ...prev,
      ...data,
    }))
  }, [dynamicAttributes, editingItem])

  const handleAdd = () => {
    setEditingItem(null)
    setFormValues({} as ProduitType)
    setIsModalOpen(true)
  }

  const handleEdit = (item: ProduitType) => {
    setFormValues({
      ...item,
      product_type_id: item.product_type_id,
    })
    setEditingItem(item)

    setIsModalOpen(true)
  }

  const handleView = (item: ProduitType) => {
    setEditingItem(item)
    console.log('Product Details:', formValues)
  }

  const handleDelete = (item: ProduitType) => {
    setProduits(produits.filter((a) => a.id !== item.id))
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData()

      Object.entries(formValues).forEach(([key, value]) => {
        if (key === 'attributes') return

        if (value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'string' || typeof value === 'number') {
          formData.append(key, String(value))
        }
      })

      if (formValues.attributes?.length) {
        formData.append('attributes', JSON.stringify(formValues.attributes))
      }

      if (editingItem) {
        // await updateProduit(formValues.id, formData)
        // handleFetchProduits()
        console.log('Updating product with data:', formValues)

        setEditingItem(null)
      } else {
        await createProduit(formData)
        handleFetchProduits()
      }

      setIsModalOpen(false)
      setFormValues({} as ProduitType)
    } catch (error) {
      console.error('Error submitting product:', error)
    }
  }
  const handleFetchProduits = async () => {
    try {
      const data = await getProduits()
      if (data) {
        setProduits(data)
      }
      console.log('Fetched produits:', data)
    } catch (error) {
      console.error('Error fetching acteurs:', error)
    }
  }
  async function fetchTypesProduits() {
    const data = await getTypesProduits()
    setTypesProduits(data)
  }
  useEffect(() => {
    ;(handleFetchProduits(), fetchTypesProduits())
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Produits</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les produits du marché et leurs types
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsTypesModalOpen(true)}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Types de produits
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </div>
        </div>
        {typesProduits.length > 0 && (
          <Tabs defaultValue={`type-${typesProduits[0].id}`}>
            <TabsList className="mb-4">
              {typesProduits.map((type) => (
                <TabsTrigger
                  key={type.id}
                  value={`type-${type.id}`}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    {type.name}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4">
              {typesProduits.map((type) => (
                <TabsContent key={type.id} value={`type-${type.id}`}>
                  <DataTable
                    data={produits.filter((p) => p.product_type_id === type.id)}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}
        <FormModal
          size="full"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="produit"
          fields={formFields}
          values={formValues}
          onChange={(name, value) =>
            setFormValues({ ...formValues, [name]: value })
          }
          onSubmit={handleSubmit}
          isEdit={!!editingItem}
        />

        <TypeProduits
          open={isTypesModalOpen}
          onClose={() => setIsTypesModalOpen(false)}
          onAddType={fetchTypesProduits}
        />
      </main>
    </div>
  )
}
