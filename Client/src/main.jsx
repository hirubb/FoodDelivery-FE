import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Pages/Auth/LoginPage'
import Register from './Pages/Auth/RegisterPage'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([


  // =============================  Customer ============================= 

  {
    path: "/",
    element: <App />,
  },

  //login and register routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register", 
    element: <Register />,
  },



  // =============================  Delivery personel ============================= 







  // =============================  Admin ========================================







  // =============================  Restuarent Admin =============================


]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
