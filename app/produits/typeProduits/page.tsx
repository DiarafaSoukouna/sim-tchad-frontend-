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
import { TypeProduitTypes } from './types'
import {
  getTypesProduits,
  createTypeProduit,
  updateTypeProduit,
  deleteTypeProduit,
} from '@/functions/typeProduits'
import { createTypeActeur, updateTypeActeur } from '@/functions/typeActeurs'

interface TypeActeursPageProps {
  open: boolean
  onClose: () => void
  onAddType?: () => void
}
export default function TypeProduitsPage({
  open,
  onClose,
  onAddType,
}: TypeActeursPageProps) {
  const [typesProduits, setTypesProduits] = useState<TypeProduitTypes[]>([])
  const [editingType, setEditingType] = useState<TypeProduitTypes | null>(null)
  const [add, setAdd] = useState(false)
  const [typeFormValues, setTypeFormValues] = useState<{
    id: number
    name: string
    code: string
    attributes: string[]
  }>({
    id: 0,
    name: '',
    code: '',
    attributes: [],
  })
  const [typeToDelete, setTypeToDelete] = useState<TypeProduitTypes | null>(
    null,
  )
  const handleAddType = () => {
    setEditingType(null)
    setAdd(true)
    setTypeFormValues({ id: 0, name: '', code: '', attributes: [] })
  }
  const handleEditType = (type: TypeProduitTypes) => {
    setEditingType(type)
    setTypeFormValues({
      id: type.id,
      name: type.name,
      code: type.code,
      attributes: type.attributes?.map((a: any) => a.name) || [],
    })
    setTypesProduits(typesProduits.filter((t) => t.id !== type.id))
  }
  const handleFetchTypes = async () => {
    try {
      const data = await getTypesProduits()
      setTypesProduits(data)
    } catch (error) {
      console.error('Error fetching types:', error)
    }
  }
  const handleSubmitType = async () => {
    try {
      const payload = {
        id: typeFormValues.id,
        name: typeFormValues.name,
        code: typeFormValues.code,
        attributes: typeFormValues.attributes.map((name) => ({ name })),
      }

      if (editingType) {
        await updateTypeProduit(payload)
        handleFetchTypes()
      } else {
        await createTypeProduit(payload)
        handleFetchTypes()
      }

      setEditingType(null)
      setAdd(false)
      setTypeFormValues({ id: 0, name: '', code: '', attributes: [] })

      if (onAddType) onAddType()
    } catch (error) {
      console.error('Error submitting type:', error)
    }
  }
  const handleDeleteType = (type: TypeProduitTypes) => {
    setTypeToDelete(type)
  }

  const confirmDeleteType = async () => {
    if (typeToDelete) {
      try {
        await deleteTypeProduit(typeToDelete.id)
        setTypesProduits(typesProduits.filter((t) => t.id !== typeToDelete.id))
      } catch (error) {
        console.error('Error deleting type:', error)
      } finally {
        setTypeToDelete(null)
      }
    }
  }
  const closeN = () => {
    setEditingType(null)
    setAdd(false)
    setTypeFormValues({
      id: 0,
      name: '',
      code: '',
      attributes: [],
    })
    handleFetchTypes()
  }
  useEffect(() => {
    handleFetchTypes()
  }, [])

  useEffect(() => {
    if (!open) {
      setEditingType(null)
      setAdd(false)
      setTypeFormValues({
        id: 0,
        name: '',
        code: '',
        attributes: [],
      })
    }
  }, [open])

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
            <DialogTitle>Types de Produits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddType} className="gap-1">
                <Plus className="h-4 w-4" />
                Ajouter un type
              </Button>
            </div>

            {editingType !== null || add ? (
              <div className="p-4 border border-border rounded-lg bg-secondary/30 space-y-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6">
                    <label className="text-xs font-medium text-muted-foreground">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={typeFormValues.name}
                      onChange={(e) =>
                        setTypeFormValues({
                          ...typeFormValues,
                          name: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-2 py-1.5 bg-input border border-border rounded-md text-sm"
                      placeholder="Nom du type"
                    />
                  </div>

                  <div className="col-span-6">
                    <label className="text-xs font-medium text-muted-foreground">
                      Code
                    </label>
                    <input
                      type="text"
                      value={typeFormValues.code}
                      onChange={(e) =>
                        setTypeFormValues({
                          ...typeFormValues,
                          code: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-2 py-1.5 bg-input border border-border rounded-md text-sm"
                      placeholder="Code"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setTypeFormValues({
                        ...typeFormValues,
                        attributes: [...typeFormValues.attributes, ''],
                      })
                    }
                  >
                    + Ajouter un attribut
                  </Button>

                  {typeFormValues.attributes.length > 0 && (
                    <div className="space-y-2">
                      {typeFormValues.attributes.map((attr, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={attr}
                            onChange={(e) => {
                              const updated = [...typeFormValues.attributes]
                              updated[index] = e.target.value
                              setTypeFormValues({
                                ...typeFormValues,
                                attributes: updated,
                              })
                            }}
                            className="flex-1 px-2 py-1.5 bg-input border border-border rounded-md text-sm"
                            placeholder="Nom de l'attribut"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => {
                              const updated = typeFormValues.attributes.filter(
                                (_, i) => i !== index,
                              )
                              setTypeFormValues({
                                ...typeFormValues,
                                attributes: updated,
                              })
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      closeN()
                    }}
                  >
                    Annuler
                  </Button>
                  <Button size="sm" onClick={handleSubmitType}>
                    {editingType ? 'Modifier' : 'Ajouter'}
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="space-y-2 overflow-y-auto">
              {typesProduits.map((type) => (
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
