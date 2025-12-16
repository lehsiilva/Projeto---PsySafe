import React, { useEffect, useRef } from 'react'
import AirDatepicker from 'air-datepicker'
import 'air-datepicker/air-datepicker.css'
import '../../styles/datepicker.css'

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  minDate?: Date
  className?: string
}

export default function DatePicker({ value, onChange, placeholder, minDate, className }: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pickerRef = useRef<AirDatepicker<HTMLInputElement> | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!inputRef.current || isInitialized.current) return

    // Initialize Air Datepicker only once
    pickerRef.current = new AirDatepicker(inputRef.current, {
      locale: {
        days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        daysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        months: [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        monthsShort: [
          'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
          'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ],
        today: 'Hoje',
        clear: 'Limpar',
        dateFormat: 'dd/MM/yyyy',
        timeFormat: 'HH:mm',
        firstDay: 0
      },
      dateFormat: 'yyyy-MM-dd',
      autoClose: true,
      minDate: minDate,
      onSelect: ({ formattedDate }) => {
        onChange(formattedDate)
      }
    })

    isInitialized.current = true

    // Set initial value if provided
    if (value) {
      pickerRef.current.selectDate(new Date(value))
    }

    // Cleanup
    return () => {
      if (pickerRef.current) {
        pickerRef.current.destroy()
        isInitialized.current = false
      }
    }
  }, [])

  // Update minDate when it changes
  useEffect(() => {
    if (pickerRef.current && minDate) {
      pickerRef.current.update({
        minDate: minDate
      })
    }
  }, [minDate])

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder || 'Selecione uma data'}
      className={className || 'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-safe focus:border-safe transition-all text-gray-700 font-medium'}
      readOnly
    />
  )
}
