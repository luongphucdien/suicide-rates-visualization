import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main';
import Facilities from './pages/facilities';
import CompareYear from './pages/compare_year';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-md bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">Suicide Rates</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/facility">Facilities</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/comparison">Comparison</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">Disabled</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className='d-flex justify-content-center'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Main/>} />
            <Route path='/facility' element={<Facilities/>} />
            <Route path='/comparison' element={<CompareYear/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
