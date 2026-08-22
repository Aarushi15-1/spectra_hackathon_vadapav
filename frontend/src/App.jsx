import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import PatientsView from './views/PatientsView';
import LabTestsView from './views/LabTestsView';
import LabReportsView from './views/LabReportsView';
import LaboratoriesView from './views/LaboratoriesView';
import AppointmentsView from './views/AppointmentsView';
import ProfileView from './views/ProfileView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendHealth, setBackendHealth] = useState({ connected: false, data: null, error: null });

  const getTitleForTab = () => {
    switch (activeTab) {
      case 'dashboard': return 'Diagnostic Command Centre';
      case 'patients': return 'ABHA Patient Directory';
      case 'lab-tests': return 'Diagnostic Panel Catalog';
      case 'lab-reports': return 'FHIR Diagnostic Reports';
      case 'laboratories': return 'Accredited Lab Network';
      case 'appointments': return 'Specimen Collection Queues';
      case 'profile': return 'Pathologist Station & Config';
      default: return 'Laboratory Gateway';
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView backendHealth={backendHealth} />;
      case 'patients':
        return <PatientsView />;
      case 'lab-tests':
        return <LabTestsView />;
      case 'lab-reports':
        return <LabReportsView />;
      case 'laboratories':
        return <LaboratoriesView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'profile':
        return <ProfileView backendHealth={backendHealth} />;
      default:
        return <DashboardView backendHealth={backendHealth} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-canvas">
        <Header
          title={getTitleForTab()}
          activeTab={activeTab}
          onHealthStatusChange={(status) => setBackendHealth(status)}
        />
        {renderActiveView()}
      </main>
    </div>
  );
}

export default App;
