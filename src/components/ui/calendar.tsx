"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  mode?: "single" | "multiple" | "range"
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect, mode = "single", ...props }, ref) => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null)
    
    const handleDateClick = (day: number) => {
      const date = new Date(currentYear, currentMonth, day)
      onSelect?.(date)
    }
    
    return (
      <div
        ref={ref}
        className={cn("p-3 border rounded-md bg-background", className)}
        {...props}
      >
        <div className="mb-4 text-center font-semibold">
          {new Date(currentYear, currentMonth).toLocaleDateString('es-CL', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="p-2" />
          ))}
          {days.map((day) => {
            const date = new Date(currentYear, currentMonth, day)
            const isSelected = selected && 
              date.toDateString() === selected.toDateString()
            const isToday = date.toDateString() === today.toDateString()
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "p-2 rounded-sm hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-primary text-primary-foreground",
                  isToday && "font-bold",
                  "transition-colors"
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
