import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home'
import AboutUs from './AboutUs';
import Dashboard from './Dashboard'
import Charities from './Charities';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword'
import NotFound from './NotFound';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
