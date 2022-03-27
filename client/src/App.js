import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home'
import Dashboard from './Dashboard'
import Charities from './Charities';
import Register from './Register';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
