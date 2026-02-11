'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'

import { Button } from '@/components/ui/button'

import { FormModal } from '@/components/form-modal'

import { Settings2, Plus, Pencil, Trash2, Type, Folder } from 'lucide-react'
import { ActorType } from './types'
import TypeActeursPage from './typeActeurs/page'
import { useCategoryFormFields } from './form'
import { getTypesActeurs } from '@/functions/typeActeurs'
import {
  getActeurs,
  createActeur,
  updateActeur,
  deleteActeur,
} from '@/functions/acteurs'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TypeActeurTypes } from './typeActeurs/types'
import { set } from 'date-fns'
import Loading from '@/components/ui/Loading'
import { showError, showSuccess } from '@/components/ui/sweetAlert'
export default function ActeursPage() {
  const [acteurs, setActeurs] = useState<ActorType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ActorType | null>(null)
  const [editingType, setEditingType] = useState<ActorType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState<ActorType>({} as ActorType)
  const [typesActeurs, setTypesActeurs] = useState<TypeActeurTypes[]>([])
  const { formFields } = useCategoryFormFields()

  const columns = [
    { key: 'code' as const, label: 'Code' },
    { key: 'actor' as const, label: 'Nom' },
    { key: 'actor_sigle' as const, label: 'Sigle' },
    { key: 'address' as const, label: 'Adresse' },
    { key: 'email' as const, label: 'Email' },
    { key: 'phone' as const, label: 'Téléphone' },
    {
      key: 'logo' as const,
      label: 'Logo',
      render: (item: ActorType) => {
        if (!item.logo) return '-'

        return (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.logo}`}
            alt="logo"
            className="h-10 w-10 object-cover rounded-md border"
          />
        )
      },
    },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setFormValues({} as ActorType)
    setIsModalOpen(true)
  }

  const handleEdit = (item: ActorType) => {
    setEditingItem(item)
    setFormValues({
      id: item.id,
      actor: item.actor,
      actor_sigle: item.actor_sigle,
      email: item.email,
      phone: item.phone,
      whatsapp: item.whatsapp,
      actor_type_id: item.actor_type_id,
      headquarter_photo: undefined,
      logo: undefined,
      address: item.address,
      latitude: item.latitude,
      longitude: item.longitude,
      code: item.code,
      description: item.description || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (item: ActorType) => {
    setActeurs(acteurs.filter((a) => a.id !== item.id))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      Object.entries(formValues).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'string' || typeof value === 'number') {
          formData.append(key, String(value))
        }
      })

      if (editingItem) {
        await updateActeur(formValues.id, formData)

        setEditingItem(null)
      } else {
        await createActeur(formData)
      }

      await handleFetchActeurs()
      setIsModalOpen(false)
      setFormValues({} as ActorType)
      showSuccess(editingItem ? 'Acteur mise à jour avec succèss' : 'Acteur ajouté avec succèss')
      setIsLoading(true)
    } catch (error) {
      showError("Erreur lors de l'ajout de l'acteur")
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleFetchActeurs = async () => {
    try {

      setIsLoading(true)
      const data = await getActeurs()
      if (data) {
        setActeurs(data)
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching acteurs:', error)
    } finally {
      setIsLoading(false)
    }
  }
  async function fetchTypesActeurs() {
    try {
      setIsLoading(true)
      const data = await getTypesActeurs()
      setTypesActeurs(data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    ; (handleFetchActeurs(), fetchTypesActeurs())
  }, [])
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Acteurs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les acteurs du marché et leurs types
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsTypesModalOpen(true)}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Types d'acteurs
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un acteur
            </Button>
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) :
          typesActeurs.length > 0 && (
            <Tabs defaultValue={`type-${typesActeurs[0].id}`}>
              <TabsList className="mb-4">
                {typesActeurs.map((type) => (
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
                {typesActeurs.map((type) => (
                  <TabsContent key={type.id} value={`type-${type.id}`}>

                    <DataTable
                      data={acteurs.filter((a) => a.actor_type_id === type.id)}
                      columns={columns}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )
        }
        <FormModal
          loading={isLoading}
          size="full"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="acteur"
          fields={formFields}
          values={formValues}
          onChange={(name, value) =>
            setFormValues({ ...formValues, [name]: value })
          }
          onSubmit={handleSubmit}
          isEdit={!!editingItem}
        />

        <TypeActeursPage
          open={isTypesModalOpen}
          onClose={() => setIsTypesModalOpen(false)}
          onAddType={fetchTypesActeurs}
        />
      </main>
    </div>
  )
}
