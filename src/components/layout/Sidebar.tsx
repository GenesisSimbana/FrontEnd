import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { ROUTES } from '../../constants';

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: '📊',
  },
  {
    label: 'Usuarios',
    href: ROUTES.USERS,
    icon: '👥',
  },
  {
    label: 'Vehículos',
    href: ROUTES.VEHICLES,
    icon: '🚗',
  },
  {
    label: 'Vendedores',
    href: '/vendedores',
    icon: '👔',
  },
  {
    label: 'Concesionarios',
    href: ROUTES.CONCESIONARIOS,
    icon: '🏢',
  },
  {
    label: 'Productos de Crédito',
    href: ROUTES.PRODUCTS,
    icon: '💳',
    children: [
      {
        label: 'Productos',
        href: ROUTES.PRODUCTS,
        icon: '📋',
      },
      {
        label: 'Tasas de Interés',
        href: ROUTES.PRODUCTS_INTEREST,
        icon: '📈',
      },
    ],
  },
  {
    label: 'Simulador',
    href: ROUTES.CREDIT_SIMULATION,
    icon: '🧮',
  },
  {
    label: 'Solicitudes',
    href: ROUTES.LOANS,
    icon: '📄',
  },
  {
    label: 'Análisis Crediticio',
    href: ROUTES.ANALYSIS,
    icon: '🔍',
  },
  {
    label: 'Contratos',
    href: ROUTES.CONTRACTS,
    icon: '📑',
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const SidebarItemComponent: React.FC<{ item: SidebarItem; level?: number }> = ({
    item,
    level = 0,
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const [isExpanded, setIsExpanded] = React.useState(active);

    React.useEffect(() => {
      if (active) {
        setIsExpanded(true);
      }
    }, [active]);

    const handleClick = () => {
      if (hasChildren) {
        setIsExpanded(!isExpanded);
      }
    };

    return (
      <div className="mb-1">
        <div
          className={cn(
            'flex items-center px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer',
            'hover:bg-gray-100',
            active && 'bg-blue-100 text-blue-700 font-medium',
            level > 0 && 'ml-4'
          )}
          onClick={handleClick}
        >
          {hasChildren ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-3">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && (
                <span
                  className={cn(
                    'transform transition-transform',
                    isExpanded ? 'rotate-90' : 'rotate-0'
                  )}
                >
                  ▶
                </span>
              )}
            </div>
          ) : (
            <Link to={item.href} className="w-full flex items-center">
              <span className="text-lg mr-3">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.children?.map((child) => (
              <SidebarItemComponent
                key={child.href}
                item={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl">🏦</span>
            {!isCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">
                  AutoCredit
                </h1>
                <p className="text-xs text-gray-500">
                  Sistema de Préstamos
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-600">
              {isCollapsed ? '▶' : '◀'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <SidebarItemComponent key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Usuario</p>
              <p className="text-xs text-gray-500">Agente de Crédito</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;