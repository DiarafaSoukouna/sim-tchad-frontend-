'use client'

import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Loading from './ui/Loading'

interface FormField {
  name: string
  label: string
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'textarea'
    | 'select'
    | 'file'
    | 'tel'
    | 'number'
    | 'date'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  fullWidth?: boolean
  hiddenOnEdit?: boolean
}

interface FormModalProps<T extends Record<string, any>> {
  open: boolean
  loading: boolean
  onClose: () => void
  title: string
  fields: FormField[]
  values: T
  onChange: <K extends keyof T>(name: K, value: T[K]) => void
  onSubmit: () => void
  isEdit?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeClasses: Record<NonNullable<FormModalProps<any>['size']>, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-2xl',
}

export function FormModal<T extends Record<string, any>>({
  open,
  loading,
  onClose,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  isEdit = false,
  size = 'md',
}: FormModalProps<T>) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`backdrop-blur-sm ${sizeClasses[size]}  flex flex-col overflow-hidden`}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Modifier ${title}` : `Ajouter ${title}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 pr-2 overflow-y-auto min-h-0 flex-1">
            {fields
              .filter((field) => !(isEdit && field.hiddenOnEdit))
              .map((field) => (
                <div
                  key={field.name}
                  className={`flex flex-col ${field.fullWidth ? 'col-span-2' : ''}`}
                >
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>

                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.name}
                      placeholder={field.placeholder}
                      value={String(values[field.name as keyof T] ?? '')}
                      onChange={(e) =>
                        onChange(field.name as keyof T, e.target.value as any)
                      }
                      required={field.required}
                      className="bg-input"
                    />
                  ) : field.type === 'select' ? (
                    <Select
                      value={String(values[field.name as keyof T] ?? '')}
                      onValueChange={(value) =>
                        onChange(field.name as keyof T, value as any)
                      }
                    >
                      <SelectTrigger id={field.name} className="bg-input">
                        <SelectValue
                          placeholder={field.placeholder || 'Sélectionner...'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'file' ? (
                    <Input
                      id={field.name}
                      type="file"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        onChange(
                          field.name as keyof T,
                          e.target.files[0] as any,
                        )
                      }
                      required={field.required}
                      className="bg-input"
                    />
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={String(values[field.name as keyof T] ?? '')}
                      onChange={(e) =>
                        onChange(field.name as keyof T, e.target.value as any)
                      }
                      required={field.required}
                      className="bg-input"
                    />
                  )}
                </div>
              ))}
          </div>

          <DialogFooter className="gap-2 pt-4 border-t shrink-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {loading ? (
                <Loading color="white" size={5} />
              ) : isEdit ? (
                'Modifier'
              ) : (
                'Ajouter'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
