import React from 'react';
import Button from '../../components/ui/Button';

const ContractsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contratos y Garantías</h1>
        <Button>Nuevo Contrato</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📑</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gestión de Contratos
          </h3>
          <p className="text-gray-600">
            Administra contratos, garantías, seguros y documentos legales del proceso crediticio.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900">Pendientes Firma</h4>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900">Activos</h4>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900">Completados</h4>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900">Vencen Pronto</h4>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;