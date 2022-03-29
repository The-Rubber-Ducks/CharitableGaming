import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Charities from './components/Charities';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword'
import NotFound from './components/NotFound';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import './App.scss';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          {/* <Route path='/' element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
