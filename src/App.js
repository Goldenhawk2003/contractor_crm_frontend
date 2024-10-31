import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BecomeAContractor from './components/BecomeAContractor';
import Contact from './components/Contact.js';
import Home from './components/Home';
import Jobs from './components/Jobs';
import Layout from './components/Layout.js';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="become-a-contractor" element={<BecomeAContractor />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="login" element={<Login />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;