import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import ImageEditor from "./ImageEditor"; // Ensure this is the correct path
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:page?" element={<ImageGallery />} />
        <Route path="/edit/:id/:page" element={<ImageEditor />} />
      </Routes>
    </Router>
  );
}

export default App;

