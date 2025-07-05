import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';

interface NavbarProps {
  onSidebarToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/users':
        return 'Gestión de Usuarios';
      case '/vehicles':
        return 'Catálogo de Vehículos';
      case '/products':
        return 'Productos de Crédito';
      case '/products/interest':
        return 'Tasas de Interés';
      case '/credit-simulation':
        return 'Simulador de Crédito';
      case '/loans':
        return 'Solicitudes de Préstamo';
      case '/analysis':
        return 'Análisis Crediticio';
      case '/contracts':
        return 'Contratos y Garantías';
      default:
        return 'Sistema de Préstamos Automotrices';
    }
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs = [
      { label: 'Inicio', href: '/dashboard' }
    ];

    if (segments.length > 0) {
      let currentPath = '';
      segments.forEach((segment) => {
        currentPath += `/${segment}`;
        let label = segment;
        
        // Mapear segmentos a labels más amigables
        switch (segment) {
          case 'users':
            label = 'Usuarios';
            break;
          case 'vehicles':
            label = 'Vehículos';
            break;
          case 'products':
            label = 'Productos';
            break;
          case 'interest':
            label = 'Tasas de Interés';
            break;
          case 'credit-simulation':
            label = 'Simulador';
            break;
          case 'loans':
            label = 'Solicitudes';
            break;
          case 'analysis':
            label = 'Análisis';
            break;
          case 'contracts':
            label = 'Contratos';
            break;
          case 'dashboard':
            return; // No agregar dashboard ya que está en inicio
        }

        breadcrumbs.push({
          label: label.charAt(0).toUpperCase() + label.slice(1),
          href: currentPath,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            
            {/* Breadcrumbs */}
            <nav className="flex space-x-1 text-sm text-gray-500 mt-1">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                  {i > 0 && <span>/</span>}
                  <Link
                    to={crumb.href}
                    className={cn(
                      'hover:text-gray-700 transition-colors',
                      i === breadcrumbs.length - 1 && 'text-gray-900 font-medium'
                    )}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors relative">
            <span className="sr-only">Notificaciones</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17H4l5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <span className="sr-only">Configuración</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* User menu */}
          <div className="relative">
            <button className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">Usuario Actual</p>
                <p className="text-xs text-gray-500">Agente de Crédito</p>
              </div>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;