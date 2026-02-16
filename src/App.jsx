import React from 'react';
import { Routes, Route } from "react-router-dom";
import IncidentList from './component/IncidentList/IncidentList';
import CreateIncident from './component/CreateIncident/CreateIncident';
import IncidentDetail from './component/IncidentDetails/IncidentDetail';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<IncidentList />} />
        <Route path="/create" element={<CreateIncident />} />
        <Route path="/incident/:id" element={<IncidentDetail />} />
      </Routes>
    </div>
  );
}

export default App