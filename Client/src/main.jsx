import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DeliverySignUp from '../src/Pages/Delivery personnel/DeliverySignUp.jsx';
import VehicleOptionsSignUp from '../src/Pages/Delivery personnel/VehicleOptionsSignUp.jsx';


const router = createBrowserRouter([


  // =============================  Customer ============================= 

  {
    path: "/",
    element: <App />,
  },



  // =============================  Delivery personel ============================= 


  {
    path: "DeliverySignUp",
    element: <DeliverySignUp />,
  },

  {
    path: "VehicleOptionsSignUp",
    element: <VehicleOptionsSignUp />,
  },




  // =============================  Admin ========================================







  // =============================  Restuarent Admin =============================


]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
