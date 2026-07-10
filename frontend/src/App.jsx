import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Onboarding from "./pages/Onboarding";
import Chatbot from "./pages/Chatbot";
import Applications from "./pages/Application";

function App() {
  return (
    <BrowserRouter>
      <Routes>
<Route path="/" element={<Login />} />
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/jobs"
  element={
    <ProtectedRoute>
      <Jobs />
    </ProtectedRoute>
  }
/>

<Route
  path="/candidates"
  element={
    <ProtectedRoute>
      <Candidates />
    </ProtectedRoute>
  }
/>

<Route
  path="/applications"
  element={
    <ProtectedRoute>
      <Applications />
    </ProtectedRoute>
  }
/>

<Route
  path="/onboarding"
  element={
    <ProtectedRoute>
      <Onboarding />
    </ProtectedRoute>
  }
/>

<Route
  path="/chatbot"
  element={
    <Chatbot/>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
