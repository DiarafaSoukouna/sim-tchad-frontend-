'use client'

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
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TypeActeurTypes } from './types'
import {
  getTypesActeurs,
  createTypeActeur,
  updateTypeActeur,
  deleteTypeActeur,
} from '@/functions/typeActeurs'
import { showError, showSuccess } from '@/components/ui/sweetAlert'

interface TypeActeursPageProps {
  open: boolean
  onClose: () => void
  onAddType?: () => void
}

export default function TypeActeursPage({
  open,
  onClose,
  onAddType,
}: TypeActeursPageProps) {
  const [typesActeurs, setTypesActeurs] = useState<TypeActeurTypes[]>([])
  const [editingType, setEditingType] = useState<TypeActeurTypes | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [add, setAdd] = useState(false)
  const [typeFormValues, setTypeFormValues] = useState<
    { id: number; name: string; code: string }[]
  >([])
  const [typeToDelete, setTypeToDelete] = useState<TypeActeurTypes | null>(null)
  const addAnotherTypeField = () => {
    setTypeFormValues([...typeFormValues, { id: 0, name: '', code: '' }])
  }
  const handleAddType = () => {
    setEditingType(null)
    setAdd(true)
    setTypeFormValues([{ id: 0, name: '', code: '' }])
  }
  const handleEditType = (type: TypeActeurTypes) => {
    setEditingType(type)
    setTypeFormValues([{ id: type.id, name: type.name, code: type.code }])
    setTypesActeurs(typesActeurs.filter((t) => t.id !== type.id))
  }
  const handleFetchTypes = async () => {
    try {
      setIsLoading(true)
      const data = await getTypesActeurs()
      setTypesActeurs(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching types:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleSubmitType = async () => {
    try {
      setIsLoading(true)
      if (editingType) {
        await updateTypeActeur(typeFormValues[0])
        handleFetchTypes()
        setEditingType(null)
        setTypeFormValues([])
      } else {
        for (const typeData of typeFormValues) {
          await createTypeActeur(typeData)
        }
        handleFetchTypes()
        setAdd(false)
        setTypeFormValues([])
      }

      // Notify parent to refresh types if callback provided
      if (onAddType) onAddType()
      setIsLoading(false)
      showSuccess(editingType ?
        'Type acteur mise à jour avec succèss' :
        'Type acteur ajouté avec succès'
      )
    } catch (error) {
      showError("Erreur lors de l'ajout du type acteur")
      console.error('Error submitting type:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleDeleteType = (type: TypeActeurTypes) => {
    setTypeToDelete(type)
  }

  const confirmDeleteType = async () => {
    if (typeToDelete) {
      try {
        setIsLoading(true)
        await deleteTypeActeur(typeToDelete.id)
        setTypesActeurs(typesActeurs.filter((t) => t.id !== typeToDelete.id))
        setIsLoading(false)

        showSuccess('Type acteur supprimé avec succèss')
      } catch (error) {
        showError("Erreur lors de la suppression du type acteur")
        console.error('Error deleting type:', error)
      } finally {
        setTypeToDelete(null)
        setIsLoading(false)
      }
    }
  }
  useEffect(() => {
    handleFetchTypes()
  }, [])
  return (
    <>
      <AlertDialog
        open={typeToDelete !== null}
        onOpenChange={(open) => !open && setTypeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le type d'acteur "
              {typeToDelete?.name}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteType}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="xl:max-w-2xl w-full max-h-[85vh] min-h-[60vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Types d'Acteurs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddType} className="gap-1">
                <Plus className="h-4 w-4" />
                Ajouter un type
              </Button>
            </div>

            {editingType !== null || add ? (
              <div className="p-4 border border-border rounded-lg bg-secondary/30">
                <div className="space-y-3">
                  {typeFormValues.map((field, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-end"
                    >
                      <div className="col-span-4">
                        <label className="text-xs font-medium text-muted-foreground">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => {
                            const updated = [...typeFormValues]
                            updated[index].name = e.target.value
                            setTypeFormValues(updated)
                          }}
                          className="w-full mt-1 px-2 py-1.5 bg-input border border-border rounded-md text-sm"
                          placeholder="name du type"
                        />
                      </div>

                      <div className="col-span-7">
                        <label className="text-xs font-medium text-muted-foreground">
                          Code
                        </label>
                        <input
                          type="text"
                          value={field.code || ''}
                          onChange={(e) => {
                            const updated = [...typeFormValues]
                            updated[index].code = e.target.value
                            setTypeFormValues(updated)
                          }}
                          className="w-full mt-1 px-2 py-1.5 bg-input border border-border rounded-md text-sm"
                          placeholder="Code"
                        />
                      </div>
                      {!editingType && (
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              const updated = typeFormValues.filter(
                                (_, i) => i !== index,
                              )
                              setTypeFormValues(updated)
                            }}
                            disabled={typeFormValues.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {!editingType && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={addAnotherTypeField}
                      className="text-xs"
                    >
                      + Ajouter un autre type
                    </Button>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (editingType) {
                          setTypesActeurs([...typesActeurs, editingType])
                        }

                        setEditingType(null)
                        setAdd(false)
                        setTypeFormValues([])
                      }}
                    >
                      Annuler
                    </Button>
                    <Button size="sm" onClick={handleSubmitType}>
                      {editingType ? 'Modifier' : 'Ajouter'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-2 overflow-y-auto">
              {typesActeurs.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                >
                  <div>
                    <p className="font-medium text-sm">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{type.code}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditType(type)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteType(type)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
