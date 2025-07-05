import React from 'react';
import Button from '../../components/ui/Button';

const AnalysisPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Análisis Crediticio</h1>
        <Button>Nuevo Análisis</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Centro de Análisis Crediticio
          </h3>
          <p className="text-gray-600">
            Evalúa el riesgo crediticio de los solicitantes y genera recomendaciones automáticas.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900">Riesgo Bajo</h4>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900">Riesgo Medio</h4>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900">Riesgo Alto</h4>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900">Riesgo Muy Alto</h4>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;