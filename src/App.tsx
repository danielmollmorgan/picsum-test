import { Routes, Route } from 'react-router-dom';
import ImageGallery from './ImageGallery';
import ImageEditor from './ImageEditor';
import NotFound from './NotFound'; 
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/:page?" element={<ImageGallery />} />
      <Route path="/edit/:id/:page" element={<ImageEditor />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
