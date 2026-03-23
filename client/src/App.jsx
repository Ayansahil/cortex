import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/authStore";

// Pages (to be created)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import ItemDetail from "./pages/ItemDetail";
import Search from "./pages/Search";
import Collections from "./pages/Collections";
import Graph from "./pages/Graph";
import Highlights from "./pages/Highlights";
import MainLayout from "./layouts/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected Main Routes */}
          <Route element={
            <ProtectedRoute>
              <ErrorBoundary>
                <MainLayout />
              </ErrorBoundary>
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="items/:id" element={<ItemDetail />} />
            <Route path="search" element={<Search />} />
            <Route path="collections" element={<Collections />} />
            <Route path="graph" element={<Graph />} />
            <Route path="highlights" element={<Highlights />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;