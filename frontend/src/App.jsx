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
      case 'dashboard': return 'Dashboard Overview';
      case 'patients': return 'Patient Records';
      case 'lab-tests': return 'Diagnostic Test Catalog';
      case 'lab-reports': return 'Diagnostic Reports';
      case 'laboratories': return 'Partner Laboratories';
      case 'appointments': return 'Sample Collection Appointments';
      case 'profile': return 'User Profile & Settings';
      default: return 'Dashboard';
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
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header
          title={getTitleForTab()}
          onHealthStatusChange={(status) => setBackendHealth(status)}
        />
        {renderActiveView()}
      </main>
    </div>
  );
}

export default App;
