import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import './styles/App.css'
import RegisterEmploye from './pages/RegisterEmploye'
import RegisterCompany from './pages/RegisterCompany'
import RegisterJobs from './pages/RegisterJobs'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/resgitarEmpleado" element={<RegisterEmploye/>}/>
        <Route path="/resgitarEmpresa" element={<RegisterCompany/>}/>
        <Route path="/resgitarTrabajo" element={<RegisterJobs/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  )
}
