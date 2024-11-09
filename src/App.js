import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup'; // Added Signup import
import ClientProfile from './components/Clients/ ClientProfile';
import ClientForm from './components/Clients/ClientForm';
import ClientsList from './components/Clients/ClientsList';
import Contact from './components/Contact';
import ContractorForm from './components/Contractors/ContractorForm';
import ContractorProfile from './components/Contractors/ContractorProfile';
import ContractorsList from './components/Contractors/ContractrorsList.js';
import Dashboard from './components/Dashboard/Dashboard'; // Added Dashboard import
import Home from './components/Home';
import Layout from './components/Layout';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Client-related routes */}
          <Route path="clients" element={<ClientsList />} />
          <Route path="clients/:id" element={<ClientProfile />} />
          <Route path="clients/edit/:id" element={<ClientForm />} />
          <Route path="clients/add" element={<ClientForm />} />
          {/* Contractor-related routes */}
          <Route path="contractors" element={<ContractorsList />} />
          <Route path="contractors/:id" element={<ContractorProfile />} />
          <Route path="contractors/edit/:id" element={<ContractorForm />} />
          <Route path="contractors/add" element={<ContractorForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;