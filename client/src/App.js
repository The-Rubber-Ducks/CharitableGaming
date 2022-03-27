import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Dashboard from './Dashboard'
import Charities from './Charities';
import Register from './Register';
import NavigationBar from './NavigationBar';

function App() {  
  return (
      <div className="App">
        <BrowserRouter>
          <NavigationBar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/charities" element={<Charities />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
