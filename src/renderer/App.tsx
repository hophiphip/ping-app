import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './routes/Index';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
  );
}
