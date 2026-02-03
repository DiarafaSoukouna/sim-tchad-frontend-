'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('space-y-2', className)}>
        <Label
          htmlFor={fieldId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </Label>
        <Input
          ref={ref}
          id={fieldId}
          className={cn(
            'bg-input border-border focus:border-primary focus:ring-primary',
            error && 'border-destructive'
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)
FormField.displayName = 'FormField'
