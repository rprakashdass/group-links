import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './Pages/Group/Group';
import Page from './Pages/Group/GenerateLink';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<Page/>}/>
        <Route path='/group/:groupUrl' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
