import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Properties from "./pages/Properties";
import CreateProperty from "./pages/CreateProperty";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <h1 className="text-3xl font-bold underline text-center mt-10 text-[var(--color-text-main)]">
                  Welcome to PropVault
                </h1>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/create-property" element={<CreateProperty />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
