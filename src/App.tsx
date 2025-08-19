import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PlayersPage from './pages/PlayersPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import UniformsPage from './pages/UniformsPage';
import RegistrationPage from './pages/RegistrationPage';
import CoachesPage from './pages/CoachesPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected & nested routes under Layout */}
          {isAuthenticated ? (
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="dashboard" />} />
              
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="players"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <PlayersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="subscriptions"
                element={
                  <ProtectedRoute>
                    <SubscriptionsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="uniforms"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <UniformsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="registration"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <RegistrationPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="coaches"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CoachesPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
