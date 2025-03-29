import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './Pages/Home'
import OwnerRegister from './components/ResturantManagement/OwnerRegister'
import RestaurantRegister from './components/ResturantManagement/RestaurantRegister'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // Set Home page as default
  },
  {
    path: "/owner-register",
    element: <OwnerRegister />,
  },
  {
    path: "/restaurant-register",
    element: <RestaurantRegister />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
