
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkoutPage from "./pages/WorkoutPage";
import "./App.css";

function App() {
  console.log("App is rendering - clean version");
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="p-8">Home Page</div>} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="*" element={<div className="p-8">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
