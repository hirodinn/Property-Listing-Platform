import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <div className="container mx-auto px-4">
          {/* Placeholder for Routes */}
          <h1 className="text-3xl font-bold underline text-center mt-10">
            Property Listing Platform
          </h1>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
