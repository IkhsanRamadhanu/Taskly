import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail'; // Import TaskDetail

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/add-task" element={<TaskForm />} />
        <Route path="/edit-task/:id" element={<TaskForm />} />
        <Route path="/task-detail/:id" element={<TaskDetail />} /> {/* Add TaskDetail route */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
