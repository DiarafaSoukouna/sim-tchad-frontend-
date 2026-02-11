'use client'

import { useEffect, useState } from 'react'
import { NamesProduct } from './types'
import {
  getNamesProduct,
  addNameProduct,
  deleteNameProduct,
} from '@/functions/produits'
import { getLangues } from '@/functions/langues'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from '@/components/ui/Loading'

interface Props {
  id: number
  open: boolean
  onClose: () => void
}

interface NameFormRow {
  language_id: string
  name: string
}

interface Language {
  id: number
  name: string
}

export function NameOfTypeProduitAttribute({ id, open, onClose }: Props) {
  const [productNames, setProductNames] = useState<NamesProduct[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [nameRows, setNameRows] = useState<NameFormRow[]>([])
  const [nameToDelete, setNameToDelete] = useState<NamesProduct | null>(null)

  // Charger toutes les langues
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getLangues()
        if (res) setLanguages(res)
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }
    fetchLanguages()
  }, [])

  const fetchProductNames = async () => {
    try {
      setLoading(true)
      const res = await getNamesProduct(id)
      setProductNames(res)
    } catch (error) {
      console.error('Error fetching product names:', error)
    } finally {
      setLoading(false)
    }
  }

  // Charger les noms existants pour le produit
  useEffect(() => {
    if (!id) return
    fetchProductNames()
  }, [id])

  // Ajouter une nouvelle ligne
  const handleAddNameRow = () => {
    setIsAdding(true)
    setNameRows([{ language_id: '', name: '' }])
  }

  // Ajouter plus de lignes
  const handleAddMoreRow = () => {
    setNameRows([...nameRows, { language_id: '', name: '' }])
  }

  // Supprimer une ligne
  const handleRemoveRow = (index: number) => {
    const updated = nameRows.filter((_, i) => i !== index)
    setNameRows(updated)
    if (updated.length === 0) setIsAdding(false)
  }

  // Mettre à jour une ligne
  const handleRowChange = (
    index: number,
    field: 'language_id' | 'name',
    value: string,
  ) => {
    const updated = [...nameRows]
    updated[index][field] = value
    setNameRows(updated)
  }

  // Soumettre le formulaire
  const handleSubmit = async () => {
    try {
      const validRows = nameRows.filter((row) => row.language_id && row.name)
      if (validRows.length === 0) {
        alert('Veuillez remplir au moins un nom')
        return
      }

      // Appeler l'API pour ajouter
      const data = { name_in_others_languages: validRows }
      await addNameProduct(id, data)

      // Rafraîchir les noms
      fetchProductNames()

      // Réinitialiser le formulaire
      setNameRows([])
      setIsAdding(false)
    } catch (error) {
      console.error('Error creating product names:', error)
    }
  }

  const handleCancel = () => {
    setNameRows([])
    setIsAdding(false)
  }

  // Supprimer un nom existant
  const confirmDeleteName = async () => {
    if (!nameToDelete) return
    try {
      await deleteNameProduct(id, nameToDelete.language_id)
      fetchProductNames()
      setNameToDelete(null)
    } catch (error) {
      console.error('Error deleting product name:', error)
    }
  }

  // Liste des langues déjà utilisées pour filtrer le select
  const availableLanguages = languages.filter(
    (lang) => !productNames.some((pn) => pn.language_id === lang.id),
  )

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="xl:max-w-2xl w-full max-h-[85vh] min-h-[60vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Noms des produits</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {!isAdding && (
              <div className="flex justify-end">
                <Button size="sm" onClick={handleAddNameRow} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Ajouter un nom
                </Button>
              </div>
            )}

            {isAdding && (
              <div className="p-4 border border-border rounded-lg bg-secondary/30 space-y-4">
                {nameRows.map((row, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Langue
                      </label>
                      <select
                        value={row.language_id}
                        onChange={(e) =>
                          handleRowChange(index, 'language_id', e.target.value)
                        }
                        className="w-full mt-1 px-2 py-1.5 bg-input border border-border rounded-md text-sm"
                      >
                        <option value="">Sélectionner...</option>
                        {availableLanguages
                          .filter(
                            (lang) =>
                              // Garder la langue si c'est celle déjà sélectionnée dans cette ligne
                              // OU si elle n'est pas sélectionnée dans une autre ligne
                              String(lang.id) === row.language_id ||
                              !nameRows.some(
                                (nr, i) =>
                                  i !== index &&
                                  nr.language_id === String(lang.id),
                              ),
                          )
                          .map((lang) => (
                            <option key={lang.id} value={String(lang.id)}>
                              {lang.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) =>
                          handleRowChange(index, 'name', e.target.value)
                        }
                        className="w-full mt-1 px-2 py-1.5 bg-input border border-border rounded-md text-sm"
                        placeholder="Nom du produit"
                      />
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive mt-6"
                      onClick={() => handleRemoveRow(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddMoreRow}
                  >
                    + Ajouter une autre langue
                  </Button>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      Annuler
                    </Button>
                    <Button size="sm" onClick={handleSubmit}>
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des noms existants */}
            <div className="space-y-2">
              {loading ? (
                <Loading />
              ) : productNames.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Aucun nom dans une autre langue
                </p>
              ) : (
                productNames.map((name) => (
                  <div
                    key={name.language_id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                  >
                    <div>
                      <p className="font-medium text-sm">{name.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {name.language_name}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setNameToDelete(name)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={nameToDelete !== null}
        onOpenChange={(open) => !open && setNameToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le nom "{nameToDelete?.name}" en{' '}
              {nameToDelete?.language_name} sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteName}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
