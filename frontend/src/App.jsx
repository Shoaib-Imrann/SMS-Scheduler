import React from "react";
import Signup from "./pages/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Check from "./components/Check";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateCampaign from "./pages/CreateCampaign";
import History from "./pages/History";
import AddShopper from "./pages/AddShopper";
import Upgrade from "./pages/Upgrade";


export default function App() {
  return (
    <>
     <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Check><Signup /></Check>} />
          <Route path="/login" element={<Check><Login /></Check>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route path="create-campaign" element={<CreateCampaign />} />
              <Route path="history" element={<History />} />
              <Route path="add-shopper" element={<AddShopper />} />
              <Route path="upgrade" element={<Upgrade />} />
            </Route>
        </Routes>
      </Router>
    </>
  )
}

