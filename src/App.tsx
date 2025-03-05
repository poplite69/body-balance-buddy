
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkoutPage from "./pages/WorkoutPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import "./App.css";

function App() {
  console.log("App is rendering - clean version");
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<div className="p-8">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
