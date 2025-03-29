import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RestaurantRegister from './Pages/Restaurant/RestaurantRegister.jsx';



const router = createBrowserRouter([


  // =============================  Customer ============================= 

  {
    path: "/",
    element: <App />,
  },

  



  // =============================  Delivery personel ============================= 







  // =============================  Admin ========================================







  // =============================  Restuarent Admin =============================

  {
    path: "/restaurant/register",
    element: <RestaurantRegister/>
  },


]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
