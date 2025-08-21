import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/todos"
              element={
                <PrivateRoute>
                  <TodoList />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/todos" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
