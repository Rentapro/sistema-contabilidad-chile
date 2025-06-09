"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, isValid } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DateRange {
  from: Date | undefined
  to?: Date | undefined
}

interface DatePickerWithRangeProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
  placeholder?: string
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
  placeholder = "Seleccionar rango de fechas"
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const formatDateRange = () => {
    if (!date?.from) {
      return placeholder
    }

    if (date.to) {
      return `${format(date.from, "dd/MM/yyyy", { locale: es })} - ${format(
        date.to,
        "dd/MM/yyyy",
        { locale: es }
      )}`
    }

    return format(date.from, "dd/MM/yyyy", { locale: es })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Button
        id="date"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formatDateRange()}
      </Button>
      
      {/* Implementación simplificada - en una aplicación real usarías react-day-picker */}
      {isOpen && (
        <div className="absolute z-50 mt-2 rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">Fecha inicial:</label>
              <input
                type="date"
                className="w-full rounded border p-2"
                value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const newDate = e.target.value ? new Date(e.target.value) : undefined
                  if (newDate && isValid(newDate)) {
                    onDateChange?.({ from: newDate, to: date?.to })
                  }
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha final:</label>
              <input
                type="date"
                className="w-full rounded border p-2"
                value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const newDate = e.target.value ? new Date(e.target.value) : undefined
                  if (newDate && isValid(newDate)) {
                    onDateChange?.({ from: date?.from, to: newDate })
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
