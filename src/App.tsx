// src/App.tsx
import React, { useState } from "react";
import MainLayout from "./layouts/MainLayout";

import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LocationsPage from "./pages/LocationsPage";
// import SellersPage from "./pages/SellersPage";
import PropertiesPage from "./pages/PropertiesPage";
import TimelinePage from "./pages/TimelinePage";
// import ContactsPage from "./pages/ContactsPage";
// import SearchPage from "./pages/SearchPage";
import FilterPage from "./pages/FilterPage";
// import SettingsPage from "./pages/SettingsPage";
import ValuationPage from "./pages/ValuationPage";

function App() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "locations":
        return <LocationsPage />;
      // case "sellers":
      //   return <SellersPage />;
      case "properties":
        return <PropertiesPage />;
      case "timeline":
        return <TimelinePage />;
      // case "contacts":
      //   return <ContactsPage />;
      // case "search":
      //   return <SearchPage />;
      case "filter":
        return <FilterPage />;
      // case "settings":
      //   return <SettingsPage />;
      case "valuation":
        return <ValuationPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <MainLayout activeItem={activeItem} onItemClick={setActiveItem}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;
