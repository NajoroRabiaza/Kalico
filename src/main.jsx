import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom/client";
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
/* import Home from './page/home.jsx';
import Soupe from './AutreMenu/Soupe.jsx';
import MenuBurger from './AutreMenu/Burger.jsx';
import Dessert from './AutreMenu/Dessert.jsx';
import Riz from './AutreMenu/Riz.jsx';
import Jus from './AutreMenu/Jus.jsx';
import Menu from './page/Menu.jsx'
import Panier from './page/Panier.jsx';
 */



/* const router = createBrowserRouter([
  {
    
    path: "/",
    element: <App/>,
    children: [
   
      {
        path:"",
        element:<Home/>
      },
      {
        path:"/Login",
        element:<Login/>
      },
      {
        path:"/Riz",
        element:<Riz/>
      },
      {
        path:"/Burger",
        element:<MenuBurger/>
      },
      {
        path:"/Dessert",
        element:<Dessert/>
      },
      {
        path:"/Jus",
        element:<Jus/>
      },
      {
        path:"/Soupe",
        element:<Soupe/>
      },
      {
        path:"/Menu",
        element:<Menu/>
      },
      {
        path: '/panier',
        element: <Panier />,
      },
     
    ],
   
}
]) */

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastProvider>
    <CartProvider>
      <App />
    </CartProvider>
    </ToastProvider>
  </BrowserRouter>
  );
