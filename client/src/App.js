import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import Home from './Home'
import Charities from './Charities';
// import { BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
      <div className="App">
          <Charities />
      </div>
  );
}

export default App;
