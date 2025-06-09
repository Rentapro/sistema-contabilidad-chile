import React from 'react';
import { formatCurrency, formatRUT } from '@/lib/utils';

interface FiscalInfoChileProps {
  rut: string;
  giro: string;
  tipoContribuyente: string;
  className?: string;
}

const tipoContribuyenteLabels: Record<string, string> = {
  'primera_categoria': 'Primera Categoría',
  'segunda_categoria': 'Segunda Categoría', 
  'regimen_simplificado': 'Régimen Simplificado',
  'pro_pyme': 'Pro PyME'
};

const FiscalInfoChile: React.FC<FiscalInfoChileProps> = ({
  rut,
  giro,
  tipoContribuyente,
  className = ''
}) => {
  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h4 className="ml-2 text-sm font-medium text-blue-900">
          🇨🇱 Información Fiscal SII Chile
        </h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div>
          <span className="font-medium text-gray-700">RUT:</span>
          <div className="text-blue-800 font-mono">{formatRUT(rut)}</div>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Giro:</span>
          <div className="text-gray-900">{giro}</div>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Contribuyente:</span>
          <div className="text-gray-900">{tipoContribuyenteLabels[tipoContribuyente] || tipoContribuyente}</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="flex items-center text-xs text-blue-700">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Información registrada según normativas del SII Chile
        </div>
      </div>
    </div>
  );
};

export default FiscalInfoChile;
