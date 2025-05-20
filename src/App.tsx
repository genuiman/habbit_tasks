import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HabitProvider } from './context/HabitContext';
import { RewardProvider } from './context/RewardContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddHabit from './pages/AddHabit';
import ManageHabits from './pages/ManageHabits';
import Statistics from './pages/Statistics';
import './App.css';

function App() {
  return (
    <Router>
      <HabitProvider>
        <RewardProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddHabit />} />
              <Route path="/manage" element={<ManageHabits />} />
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </Layout>
        </RewardProvider>
      </HabitProvider>
    </Router>
  );
}

export default App;