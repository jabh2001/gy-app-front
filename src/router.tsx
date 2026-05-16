import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '@/components/own/layouts/client-layout';
import HomePage from '@/pages/home-page';
import AdminLayout from '@/components/own/layouts/admin-layout';
import AboutPage from './pages/about-page';
import ShopPage from './pages/shop-page';

// Definimos la estructura de navegación
const router = createBrowserRouter([
  {
    path: "/",
    Component:ClientLayout,
    children: [
        { index:true, element: <HomePage /> },
        { path:"/about", element: <AboutPage /> },
        { path:"/contact", element: <AboutPage /> },
        { path:"/shop", element: <ShopPage /> },
    ],
  },
  {
    path: "/admin",
    Component:AdminLayout,
    children: [
        { index:true, element: <HomePage /> }
    ],
  }
]);

export { router }