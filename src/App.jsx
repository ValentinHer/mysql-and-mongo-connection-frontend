import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUpForm from './components/SignUpForm';
import Users from './components/Users';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<SignUpForm />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
