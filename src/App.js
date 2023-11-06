
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import SlotBooking from './components/SlotBooking/SlotBooking';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/slotbook' element={<SlotBooking/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
