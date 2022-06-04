import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main';
import Facilities from './pages/facilities';

function App() {
  return (
    <div className="App d-flex justify-content-center">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main/>} />
          <Route path='/facility' element={<Facilities/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
