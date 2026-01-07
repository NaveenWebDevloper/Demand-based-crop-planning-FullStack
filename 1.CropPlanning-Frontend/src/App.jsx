import './App.css'
import {Routes,Route,Navigate} from "react-router-dom"
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import Header from './Components/Header'
import Home from './Components/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import Admin from './Components/Admin'
import User from './Components/User'

import ViewDemandCrops from './Components/ViewDemandCrops'

function App() {
  const location = useLocation();
  
  const hideHeaderRoutes = ["/admin", "/user","/addevents"];

  return (
    <>
   
      {!hideHeaderRoutes.includes(location.pathname) && <Header/>}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={ <Admin/>}/>
      <Route path="/user" element={ <User/>}/>
      <Route path="/view-demand" element={< ViewDemandCrops/>} />
   
    </Routes> 
     </>
  )
}

export default App
