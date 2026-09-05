import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import AIInsights from "./pages/AIInsights";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Route */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* Protected Application */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/expenses"
            element={<Expenses />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/budget"
            element={<Budget />}
          />

        </Route>


        {/* Default Route */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
  path="/ai-insights"
  element={
    <ProtectedRoute>
      <AIInsights />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>

  );
}

export default App;