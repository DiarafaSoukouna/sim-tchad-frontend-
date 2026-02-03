'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { UniteMesureTypes } from './uniteMesures/types'
import { DeviseTypes } from './devises/types'
import { LangueTypes } from './langues/types'
import { uniteFields } from './uniteMesures/form'
import { currencyFields } from './devises/form'
import { langueFields } from './langues/form'
import {
  getUniteMesures,
  createUniteMesure,
  updateUniteMesure,
  deleteUniteMesure,
} from '@/functions/uniteMesures'
import {
  getDevises,
  createDevise,
  updateDevise,
  deleteDevise,
} from '@/functions/devises'
import {
  getLangues,
  createLangue,
  updateLangue,
  deleteLangue,
} from '@/functions/langues'

type ModalType = 'unite' | 'currency' | 'langue' | null

export default function AutresParametragePage() {
  const [unites, setUnites] = useState<UniteMesureTypes[]>([])
  const [currencies, setCurrencies] = useState<DeviseTypes[]>([])
  const [langues, setLangues] = useState<LangueTypes[]>([])

  const [modalType, setModalType] = useState<ModalType>(null)
  const [editingItem, setEditingItem] = useState<
    UniteMesureTypes | DeviseTypes | LangueTypes | null
  >(null)
  const [formValues, setFormValues] = useState<
    UniteMesureTypes | DeviseTypes | LangueTypes
  >({} as UniteMesureTypes | DeviseTypes | LangueTypes)

  const uniteColumns = [
    { key: 'name' as const, label: 'Nom' },
    { key: 'code' as const, label: 'Code' },
  ]

  const currencyColumns = [
    { key: 'name' as const, label: 'Nom' },
    { key: 'code' as const, label: 'Code' },
    { key: 'symbol' as const, label: 'Symbole' },
  ]

  const langueColumns = [
    { key: 'name' as const, label: 'Nom' },
    { key: 'locale' as const, label: 'Locale' },
  ]

  const openModal = (
    type: ModalType,
    item?: UniteMesureTypes | DeviseTypes | LangueTypes,
  ) => {
    setModalType(type)
    if (item) {
      setEditingItem(item)
      setFormValues(item as UniteMesureTypes | DeviseTypes | LangueTypes)
    } else {
      setEditingItem(null)
      setFormValues({} as UniteMesureTypes | DeviseTypes | LangueTypes)
    }
  }

  const closeModal = () => {
    setModalType(null)
    setEditingItem(null)
    setFormValues({} as UniteMesureTypes | DeviseTypes | LangueTypes)
  }

  const handleSubmit = async () => {
    if (modalType === 'unite') {
      if (editingItem) {
        await updateUniteMesure(formValues as UniteMesureTypes)
        handleFetchUnites()
      } else {
        await createUniteMesure(formValues as UniteMesureTypes)
        handleFetchUnites()
      }
    } else if (modalType === 'currency') {
      if (editingItem) {
        await updateDevise(formValues as DeviseTypes)
        handleFetchDevises()
      } else {
        await createDevise(formValues as DeviseTypes)
        handleFetchDevises()
      }
    } else if (modalType === 'langue') {
      if (editingItem) {
        await updateLangue(formValues as LangueTypes)
        handleFetchLangues()
      } else {
        await createLangue(formValues as LangueTypes)
        handleFetchLangues()
      }
    }
    closeModal()
  }

  const handleDeleteUnite = async (item: UniteMesureTypes) => {
    try {
      await deleteUniteMesure(item.id)
      handleFetchUnites()
    } catch (error) {
      console.error('Error deleting unite:', error)
    }
  }

  const handleDeleteCurrency = async (item: DeviseTypes) => {
    try {
      await deleteDevise(item.id)
      handleFetchDevises()
    } catch (error) {
      console.error('Error deleting currency:', error)
    }
  }
  const handleDeleteLangue = async (item: LangueTypes) => {
    try {
      await deleteLangue(item.id)
      handleFetchLangues()
    } catch (error) {
      console.error('Error deleting langue:', error)
    }
  }

  const handleFetchUnites = async () => {
    try {
      const res = await getUniteMesures()
      if (res) {
        setUnites(res)
      }
    } catch (error) {
      console.error('Error fetching unites:', error)
    }
  }
  const handleFetchDevises = async () => {
    try {
      const res = await getDevises()
      if (res) {
        setCurrencies(res)
      }
    } catch (error) {
      console.error('Error fetching devises:', error)
    }
  }
  const handleFetchLangues = async () => {
    try {
      const res = await getLangues()
      if (res) {
        setLangues(res)
      }
    } catch (error) {
      console.error('Error fetching langues:', error)
    }
  }

  useEffect(() => {
    handleFetchUnites()
    handleFetchDevises()
    handleFetchLangues()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <PageHeader
          title="Autre Paramétrage"
          description="Gérez les paramètres supplémentaires du système"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                Unités de Mesure
              </CardTitle>
              <Button
                size="sm"
                onClick={() => openModal('unite')}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                data={unites}
                columns={uniteColumns}
                onEdit={(item) => openModal('unite', item)}
                onDelete={handleDeleteUnite}
                compact
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Devises</CardTitle>
              <Button
                size="sm"
                onClick={() => openModal('currency')}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                data={currencies}
                columns={currencyColumns}
                onEdit={(item) => openModal('currency', item)}
                onDelete={handleDeleteCurrency}
                compact
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Langues</CardTitle>
              <Button
                size="sm"
                onClick={() => openModal('langue')}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                data={langues}
                columns={langueColumns}
                onEdit={(item) => openModal('langue', item)}
                onDelete={handleDeleteLangue}
                compact
              />
            </CardContent>
          </Card>
        </div>

        <FormModal
          open={modalType === 'unite'}
          onClose={closeModal}
          title="unité de mesure"
          fields={uniteFields}
          values={formValues}
          onChange={(name, value) =>
            setFormValues({ ...formValues, [name]: value })
          }
          onSubmit={handleSubmit}
          isEdit={!!editingItem}
        />

        <FormModal
          open={modalType === 'currency'}
          onClose={closeModal}
          title="devise"
          fields={currencyFields}
          values={formValues}
          onChange={(name, value) =>
            setFormValues({ ...formValues, [name]: value })
          }
          onSubmit={handleSubmit}
          isEdit={!!editingItem}
        />

        <FormModal
          open={modalType === 'langue'}
          onClose={closeModal}
          title="langue"
          fields={langueFields}
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
