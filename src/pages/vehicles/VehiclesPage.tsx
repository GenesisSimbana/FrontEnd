import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import type { Vehicle, VehicleType, VehicleCategory } from '../../types/automotive-loan';

const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    make: '',
    type: '',
    category: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    loading,
    execute: fetchVehicles
  } = useApi(vehicleService.getVehicles, {
    onSuccess: (data) => {
      setVehicles(data.data);
      setTotalPages(data.totalPages);
    }
  });

  useEffect(() => {
    loadVehicles();
  }, [page]);

  const loadVehicles = () => {
    const params = {
      page,
      pageSize: 12,
      ...(filters.search && { search: filters.search }),
      ...(filters.make && { make: filters.make }),
      ...(filters.type && { type: filters.type }),
      ...(filters.category && { category: filters.category }),
      ...(filters.priceFrom && { priceFrom: parseInt(filters.priceFrom) }),
      ...(filters.priceTo && { priceTo: parseInt(filters.priceTo) }),
      ...(filters.yearFrom && { yearFrom: parseInt(filters.yearFrom) }),
      ...(filters.yearTo && { yearTo: parseInt(filters.yearTo) }),
    };
    fetchVehicles(params);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadVehicles();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      make: '',
      type: '',
      category: '',
      priceFrom: '',
      priceTo: '',
      yearFrom: '',
      yearTo: '',
    });
    setPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTypeBadge = (type: VehicleType) => {
    const typeStyles = {
      CAR: 'bg-blue-100 text-blue-800',
      SUV: 'bg-green-100 text-green-800',
      TRUCK: 'bg-orange-100 text-orange-800',
      MOTORCYCLE: 'bg-purple-100 text-purple-800',
      VAN: 'bg-gray-100 text-gray-800',
    };

    const typeLabels = {
      CAR: 'Automóvil',
      SUV: 'SUV',
      TRUCK: 'Camioneta',
      MOTORCYCLE: 'Motocicleta',
      VAN: 'Van',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyles[type]}`}>
        {typeLabels[type]}
      </span>
    );
  };

  const getCategoryBadge = (category: VehicleCategory) => {
    const categoryStyles = {
      NEW: 'bg-green-100 text-green-800',
      USED: 'bg-yellow-100 text-yellow-800',
      CERTIFIED: 'bg-blue-100 text-blue-800',
    };

    const categoryLabels = {
      NEW: 'Nuevo',
      USED: 'Usado',
      CERTIFIED: 'Certificado',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryStyles[category]}`}>
        {categoryLabels[category]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Catálogo de Vehículos</h1>
        <Button>
          Agregar Vehículo
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Buscar por marca, modelo..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="CAR">Automóvil</option>
              <option value="SUV">SUV</option>
              <option value="TRUCK">Camioneta</option>
              <option value="MOTORCYCLE">Motocicleta</option>
              <option value="VAN">Van</option>
            </select>

            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="NEW">Nuevo</option>
              <option value="USED">Usado</option>
              <option value="CERTIFIED">Certificado</option>
            </select>

            <Input
              type="number"
              placeholder="Año desde"
              value={filters.yearFrom}
              onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
            />

            <Input
              type="number"
              placeholder="Año hasta"
              value={filters.yearTo}
              onChange={(e) => handleFilterChange('yearTo', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="number"
              placeholder="Precio desde"
              value={filters.priceFrom}
              onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
            />

            <Input
              type="number"
              placeholder="Precio hasta"
              value={filters.priceTo}
              onChange={(e) => handleFilterChange('priceTo', e.target.value)}
            />

            <Button type="submit" loading={loading}>
              Buscar
            </Button>

            <Button type="button" variant="secondary" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </form>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Vehicle Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl">🚗</span>
                    </div>
                  )}
                </div>

                {/* Vehicle Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-600">{vehicle.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(vehicle.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {getTypeBadge(vehicle.type)}
                    {getCategoryBadge(vehicle.category)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      vehicle.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.isAvailable ? 'Disponible' : 'No Disponible'}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p>Motor: {vehicle.engine}</p>
                    <p>Transmisión: {vehicle.transmission === 'MANUAL' ? 'Manual' : 'Automática'}</p>
                    <p>Combustible: {vehicle.fuelType}</p>
                    <p>Puertas: {vehicle.doors}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/vehicles/${vehicle.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Ver Detalles
                    </Link>
                    <Link
                      to={`/credit-simulation?vehicleId=${vehicle.id}`}
                      className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Simular
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Anterior
                </Button>
                
                <span className="px-4 py-2 text-sm text-gray-700">
                  Página {page} de {totalPages}
                </span>
                
                <Button
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Siguiente
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VehiclesPage;