'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { useMagasinFormFields } from './form'
import { MagasinTypes } from './types'

import {
  getSecteurs,
  createSecteur,
  updateSecteur,
  deleteSecteur,
} from '@/functions/secteurs'
import { get } from 'http'
import Loading from '@/components/ui/Loading'
import { showError, showSuccess } from '@/components/ui/sweetAlert'
import { createMagasin, deleteMagasin, getMagasins, updateMagasin } from '@/functions/magasins'
import { ActorType } from '../acteurs/types'

export default function SecteursPage() {
  const [secteurs, setSecteurs] = useState<MagasinTypes[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<MagasinTypes | null>(null)
  const [formValues, setFormValues] = useState<MagasinTypes>({} as MagasinTypes)
  const { formFields, acteurs } = useMagasinFormFields()

  const columns = [
    { key: 'code' as const, label: 'Code' },
    { key: 'name' as const, label: 'Nom' },
    { key: 'phone' as const, label: 'Télephone' },
    { key: 'address' as const, label: 'Adresse' },
    {
      key: 'actor_id' as const,
      label: 'Acteur',
      render: (item: MagasinTypes) => {
        const secteur = acteurs.find((a) => a.id === item.actor_id)
        return secteur?.actor_sigle || '-'
      },
    },
    { key: 'description' as const, label: 'Description' },
  ]
  const handleFetch = async () => {
    try {
      setIsLoading(true);
      const data = await getMagasins()
      setIsLoading(false)
      setSecteurs(data)
    } catch (error) {
      throw new Error('Fetch error')
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    handleFetch()
  }, [])
  const handleAdd = () => {
    setEditingItem(null)
    setFormValues({} as MagasinTypes)
    setIsModalOpen(true)
  }

  const handleEdit = (item: MagasinTypes) => {
    setEditingItem(item)
    setFormValues({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      code: item.code,
      actor_id: item.actor_id,
      latitude: item.latitude,
      longitude: item.longitude,
      phone: item.phone,
      whatsapp: item.whatsapp,
      address: item.address,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (item: MagasinTypes) => {
    try {
      setIsLoading(true);
      await deleteMagasin(item.id)
      handleFetch()
      setIsLoading(false);
      showSuccess('Magasin supprimé avec succèss')
    } catch (error) {
      showError("Erreur lors de j'ajout du magasin");
      throw new Error('Delete error')
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (editingItem) {
        await updateMagasin(formValues!)
        handleFetch()
      } else {
        await createMagasin(formValues!)
        handleFetch()
      }
      showSuccess(editingItem ? 'Magasin mise à jour avec succèss' : 'Magasin ajouté avec succèss')
      setIsModalOpen(false)
      setFormValues({} as MagasinTypes)
    } catch (error) {
      showError("Erreur lors de l'ajout du magasin");
      throw new Error('Submit error')
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <PageHeader
          title="Magasins"
          description="Gérez les magasins"
          onAdd={handleAdd}
          addLabel="Ajouter un magasin"
        />
        {isLoading ? (
          <Loading />
        ) :
          <DataTable
            data={secteurs}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        }
        <FormModal
          size="lg"
          open={isModalOpen}
          loading={isLoading}
          onClose={() => setIsModalOpen(false)}
          title="magasin"
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
