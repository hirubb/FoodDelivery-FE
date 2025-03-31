import React from 'react'
import Header from "./layouts/Header"
import Footer from "./layouts/Footer"
import Home from './Pages/Home'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './components/Auth/AuthContext'


function App() {
  return (

    <div className="App">

      <Header/>
      <Home/>
      <Outlet /> 
      <Footer/>

    </div>
  )
}

export default App