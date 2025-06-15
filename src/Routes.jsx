// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import Breadcrumb from "components/ui/Breadcrumb";
import FinancialDashboardOverview from "pages/financial-dashboard-overview";
import TransactionHistoryAnalysis from "pages/transaction-history-analysis";
import CategoryManagement from "pages/category-management";
import TransactionFlowAnalysisDashboard from "pages/transaction-flow-analysis-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <div className="min-h-screen bg-background">
          <Header />
          <div className="pt-16">
            <Breadcrumb />
            <RouterRoutes>
              <Route path="/" element={<FinancialDashboardOverview />} />
              <Route path="/financial-dashboard-overview" element={<FinancialDashboardOverview />} />
              <Route path="/transaction-history-analysis" element={<TransactionHistoryAnalysis />} />
              <Route path="/category-management" element={<CategoryManagement />} />
              <Route path="/transaction-flow-analysis-dashboard" element={<TransactionFlowAnalysisDashboard />} />
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </div>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;