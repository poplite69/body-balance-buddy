
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkoutPage from "./pages/WorkoutPage";
import FoodPage from "./pages/FoodPage";
import JournalPage from "./pages/JournalPage";
import AICoachPage from "./pages/AICoachPage";
import CreateTemplatePage from "./pages/CreateTemplatePage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/ai-coach" element={<AICoachPage />} />
        <Route path="/create-template" element={<CreateTemplatePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
