'use client'

import { useEffect, useState, useRef } from 'react'
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
import { useRouter } from 'next/navigation'
import { NameOfTypeProduitAttribute } from './names'
import { set } from 'date-fns'

export default function ProduitsPage() {
  const [produits, setProduits] = useState<ProduitType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ProduitType | null>(null)
  const [editingType, setEditingType] = useState<TypeProduitTypes | null>(null)
  const [formValues, setFormValues] = useState<ProduitType>({} as ProduitType)
  const [typesProduits, setTypesProduits] = useState<TypeProduitTypes[]>([])
  const [isNameModalOpen, setIsNameModalOpen] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const router = useRouter()
  const [productId, setProductId] = useState<number | null>(null)
  // Flag pour savoir si on attend le remplissage des attributs dynamiques
  const [pendingEditItem, setPendingEditItem] = useState<ProduitType | null>(
    null,
  )

  const {
    formFields,
    typesProduitsAttributs,
    dynamicAttributes,
    isLoadingAttributes,
  } = useCategoryFormFields(Number(formValues.product_type_id), resetKey)

  const columns = [
    { key: 'code' as const, label: 'Code' },
    {
      key: 'name' as const,
      label: 'Nom du produit',
      render: (item: ProduitType) => (
        <Button
          type="button"
          onClick={() => {
            setProductId(item.id)
            setIsNameModalOpen(true)
          }}
          className="text-left text-white font-medium  focus:outline-none bg-green-600"
        >
          {item.name}
        </Button>
      ),
    },
    { key: 'origin' as const, label: 'Origine' },
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

  // Effect pour remplir les attributs dynamiques quand ils sont prêts
  useEffect(() => {
    if (!pendingEditItem) return
    if (isLoadingAttributes) return

    // Cas où le produit n'a aucun attribut
    if (!pendingEditItem.attributes || !pendingEditItem.attributes.length) {
      setFormValues(pendingEditItem)
      setIsModalOpen(true)
      setPendingEditItem(null)
      return
    }

    // Cas où dynamicAttributes ne sont pas encore prêts
    if (!dynamicAttributes || !dynamicAttributes.length) return

    // Remplissage des champs dynamiques
    const attributesData: Record<string, any> = {}
    dynamicAttributes.forEach((attr) => {
      const matched = pendingEditItem.attributes?.find(
        (a) => a.name === attr.name,
      )
      attributesData[attr.name] = matched?.value ?? ''
    })

    setFormValues({
      ...pendingEditItem,
      ...attributesData,
    })

    setIsModalOpen(true)
    setPendingEditItem(null)
  }, [
    pendingEditItem?.id, // stable
    isLoadingAttributes,
    dynamicAttributes.map((a) => a.name).join(','), // stable
  ])

  const handleAdd = () => {
    setEditingItem(null)
    setPendingEditItem(null)
    setFormValues({} as ProduitType)
    setIsModalOpen(true)
  }

  const handleEdit = (item: ProduitType) => {
    // Préparer les valeurs de base
    setFormValues({
      ...item,
      product_type_id: item.product_type_id,
    })
    console.log('Editing item:', dynamicAttributes)
    setEditingItem(item)

    // Marquer qu'on attend le remplissage des attributs dynamiques
    setPendingEditItem(item)

    // Le modal s'ouvrira automatiquement via le useEffect quand tout sera prêt
  }

  const handleView = (item: ProduitType) => {
    router.push(`/produits/${item.id}`)
  }

  const handleDelete = (item: ProduitType) => {
    setProduits(produits.filter((a) => a.id !== item.id))
  }
  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      const attributesArray: any[] = []

      // POUR L'ÉDITION
      if (editingItem && formValues.attributes) {
        // Créer un map des attributs (name -> attribute_id)
        const attributeMap = new Map()
        formValues.attributes.forEach((attr) => {
          attributeMap.set(attr.name, attr.attribute_id)
        })

        // Parcourir formValues
        Object.entries(formValues).forEach(([key, value]) => {
          if (key === 'attributes') return

          // Si le champ correspond à un nom d'attribut
          if (attributeMap.has(key)) {
            if (value !== null && value !== undefined && value !== '') {
              attributesArray.push({
                attribute_id: attributeMap.get(key),
                value: String(value),
              })
            }
          }
          // Champ normal
          else {
            if (value instanceof File) {
              formData.append(key, value)
            } else if (typeof value === 'string' || typeof value === 'number') {
              formData.append(key, String(value))
            }
          }
        })
      }
      // POUR L'AJOUT
      else {
        // Trouver le type de produit sélectionné
        const selectedType = typesProduitsAttributs.find(
          (t) => t.id === Number(formValues.product_type_id),
        )

        // Parcourir formValues
        Object.entries(formValues).forEach(([key, value]) => {
          // Vérifier si ce champ correspond à un attribut dynamique
          const matchingAttribute = selectedType?.attributes?.find(
            (attr) => attr.name === key,
          )

          if (matchingAttribute) {
            // C'est un attribut dynamique
            if (value !== null && value !== undefined && value !== '') {
              attributesArray.push({
                attribute_id: matchingAttribute.id, // Pour l'ajout c'est 'id' pas 'attribute_id'
                value: String(value),
              })
            }
          }
          // Champ normal
          else {
            if (value instanceof File) {
              formData.append(key, value)
            } else if (typeof value === 'string' || typeof value === 'number') {
              formData.append(key, String(value))
            }
          }
        })
      }

      // Ajouter les attributes en JSON seulement s'il y en a
      if (attributesArray.length > 0) {
        formData.append('attributes', JSON.stringify(attributesArray))
      }

      if (editingItem) {
        await updateProduit(formValues.id, formData)
        handleFetchProduits()
        console.log('Updating product with data:', formValues)
        setEditingItem(null)
      } else {
        await createProduit(formData)
        handleFetchProduits()
        console.log('Creating product with data:', formValues)
      }

      setIsModalOpen(false)
      setFormValues({} as ProduitType)
      setResetKey((k) => k + 1) // ← Réinitialiser ici aussi
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
          onClose={() => {
            setIsModalOpen(false)
            setPendingEditItem(null)
            setResetKey((k) => k + 1)
          }}
          title="produit"
          fields={formFields}
          values={formValues}
          onChange={(name, value) =>
            setFormValues({ ...formValues, [name]: value })
          }
          onSubmit={handleSubmit}
          isEdit={!!editingItem}
        />
        <NameOfTypeProduitAttribute
          id={productId!}
          open={isNameModalOpen}
          onClose={() => setIsNameModalOpen(false)}
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
