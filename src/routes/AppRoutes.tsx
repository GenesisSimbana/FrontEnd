import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

// Pages
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

// Vehicles
import VehiclesPage from '../pages/vehicles/VehiclesPage';

// Products
import ProductsPage from '../pages/products/ProductsPage';
import InterestRatesPage from '../pages/products/InterestRatesPage';

// Simulation
import CreditSimulationPage from '../pages/simulation/CreditSimulationPage';

// Loans
import LoansPage from '../pages/loans/LoansPage';

// Analysis
import AnalysisPage from '../pages/analysis/AnalysisPage';

// Contracts
import ContractsPage from '../pages/contracts/ContractsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main route - redirect to dashboard */}
      <Route path="/" element={<AppLayout><DashboardPage /></AppLayout>} />
      <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
      
      {/* Vehicles */}
      <Route path="/vehicles" element={<AppLayout><VehiclesPage /></AppLayout>} />
      
      {/* Products */}
      <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
      <Route path="/products/interest" element={<AppLayout><InterestRatesPage /></AppLayout>} />
      
      {/* Credit Simulation */}
      <Route path="/credit-simulation" element={<AppLayout><CreditSimulationPage /></AppLayout>} />
      
      {/* Loans */}
      <Route path="/loans" element={<AppLayout><LoansPage /></AppLayout>} />
      
      {/* Analysis */}
      <Route path="/analysis" element={<AppLayout><AnalysisPage /></AppLayout>} />
      
      {/* Contracts */}
      <Route path="/contracts" element={<AppLayout><ContractsPage /></AppLayout>} />
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;