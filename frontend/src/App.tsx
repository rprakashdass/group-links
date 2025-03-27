import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import GroupView from './Pages/Group/GroupView';
import Home from './Pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<Home/>}/>
        <Route path='/group/:groupUrl' element={<GroupView/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
