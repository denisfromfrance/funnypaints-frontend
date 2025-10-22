import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import UserBase from './controller/UserBase';
import Home from './pages/Home';

import "bootstrap/dist/css/bootstrap.css";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AdminLogin from './pages/admin/AdminLogin';
import AdminBase from './controller/AdminBase';
import Admin from './pages/admin/Admin';
import SendPaintRequest from './pages/SendPaintRequest';
import ProtectedView from "./controller/ProtectedView";
// import { validateUserAuthState } from './utils/Utils';
import Profile from './pages/Profile';
import PublicView from './controller/PublicView';
import Cart from './pages/Cart';


function Application(){

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAuthenticatedRef = useRef(isAuthenticated);
  const setIsAuthenticatedRef = (data: boolean) => {
      setIsAuthenticated(data);
      isAuthenticatedRef.current = data;
  }

  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' element={<PublicView element={<Home />} authenticated={isAuthenticatedRef.current} setAuthenticated={setIsAuthenticatedRef}/> } />
        <Route path='/cart' element={<PublicView element={<Cart />} authenticated={isAuthenticatedRef.current} setAuthenticated={setIsAuthenticatedRef}/> } />
        <Route path='/signup' element={<PublicView element={<SignUp setAuthenticated={setIsAuthenticatedRef}/>} authenticated={isAuthenticatedRef.current} setAuthenticated={setIsAuthenticatedRef}/> } />
        <Route path='/signin' element={<PublicView element={<SignIn setAuthenticated={setIsAuthenticatedRef}/>} authenticated={isAuthenticatedRef.current} setAuthenticated={setIsAuthenticatedRef}/> } />
        <Route path='/order-an-art' element={<PublicView element={<SendPaintRequest />} authenticated={isAuthenticatedRef.current} setAuthenticated={setIsAuthenticatedRef}/> } />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<AdminBase element={<Admin />} />} />
        <Route path='/profile' element={<ProtectedView element={<Profile />} authenticated={isAuthenticatedRef.current} setAuthenticated={setIsAuthenticatedRef} />} />
      </Routes>
    </BrowserRouter>
  );
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
)
