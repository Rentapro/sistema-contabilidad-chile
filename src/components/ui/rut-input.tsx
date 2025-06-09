'use client';

import { useState, useEffect } from 'react';
import { validateRUT, formatRUT } from '@/lib/utils';

interface RUTInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function RUTInput({
  value,
  onChange,
  placeholder = "12.345.678-9",
  error,
  label = "RUT",
  required = false,
  className = "",
}: RUTInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
    if (value) {
      const valid = validateRUT(value);
      setIsValid(valid);
    } else {
      setIsValid(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Limpiar caracteres no permitidos (solo números, K, k, puntos y guión)
    const cleanValue = inputValue
      .replace(/[^0-9Kk.-]/g, '')
      .toUpperCase();
    
    setDisplayValue(cleanValue);
    onChange(cleanValue);
  };

  const handleBlur = () => {
    // Al perder el foco, formatear el RUT si es válido
    if (value && validateRUT(value)) {
      const formatted = formatRUT(value);
      setDisplayValue(formatted);
      onChange(formatted);
    }
  };

  const getInputClassName = () => {
    let baseClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 font-mono ${className}`;
    
    if (error) {
      baseClass += ' border-red-300 focus:ring-red-500';
    } else if (isValid === true) {
      baseClass += ' border-green-300 focus:ring-green-500';
    } else if (isValid === false) {
      baseClass += ' border-red-300 focus:ring-red-500';
    } else {
      baseClass += ' border-gray-300 focus:ring-blue-500';
    }
    
    return baseClass;
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={12}
          className={getInputClassName()}
        />
        {/* Indicador visual de validación */}
        {isValid === true && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {isValid === false && value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      {!error && isValid === false && value && (
        <p className="text-red-500 text-xs mt-1">RUT inválido</p>
      )}
      {!error && isValid === true && (
        <p className="text-green-600 text-xs mt-1">RUT válido</p>
      )}
    </div>
  );
}
