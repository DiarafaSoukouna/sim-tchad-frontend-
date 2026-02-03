'use client'

import { cn } from '@/lib/utils'

import React, { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Pencil, Trash2, AlertTriangle, Eye } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onView?: (item: T) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  compact?: boolean
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  compact = false,
}: DataTableProps<T>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<T | null>(null)

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete)
    }
    setDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const handleCancelDelete = () => {
    setDeleteModalOpen(false)
    setItemToDelete(null)
  }

  return (
    <>
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center p-2 rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription className="mt-1">
                  Etes-vous sur de vouloir supprimer cet element ? Cette action
                  est irreversible.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-4">
            <Button variant="outline" onClick={handleCancelDelete}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    'font-medium text-foreground',
                    compact && 'py-2 px-3 text-xs',
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
              {(onView || onEdit || onDelete) && (
                <TableHead
                  className={cn(
                    'w-24 text-right',
                    compact && 'py-2 px-3 text-xs',
                  )}
                >
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (onView || onEdit || onDelete ? 1 : 0)
                  }
                  className="h-24 text-center text-muted-foreground"
                >
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-secondary/30">
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={cn(compact && 'py-2 px-3 text-sm')}
                    >
                      {column.render
                        ? column.render(item)
                        : String(
                            (item as Record<string, unknown>)[
                              column.key as string
                            ] ?? '',
                          )}
                    </TableCell>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <TableCell
                      className={cn('text-right', compact && 'py-2 px-3')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(item)}
                            className={cn(
                              'h-8 w-8 text-muted-foreground hover:text-primary',
                              compact && 'h-7 w-7',
                            )}
                          >
                            <Eye
                              className={cn('h-4 w-4', compact && 'h-3 w-3')}
                            />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                            className={cn(
                              'h-8 w-8 text-muted-foreground hover:text-primary',
                              compact && 'h-7 w-7',
                            )}
                          >
                            <Pencil
                              className={cn('h-4 w-4', compact && 'h-3 w-3')}
                            />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(item)}
                            className={cn(
                              'h-8 w-8 text-muted-foreground hover:text-destructive',
                              compact && 'h-7 w-7',
                            )}
                          >
                            <Trash2
                              className={cn('h-4 w-4', compact && 'h-3 w-3')}
                            />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

// function cn(...classes: (string | boolean | undefined)[]) {
//   return classes.filter(Boolean).join(" ")
// }
