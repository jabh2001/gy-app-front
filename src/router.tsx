import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '@/components/own/layouts/client-layout'
import HomePage from '@/pages/home-page'
import AdminLayout from '@/components/own/layouts/admin-layout'
import AboutPage from './pages/about-page'
import ShopPage from './pages/shop-page'
import LoginPage from '@/pages/login-page'
import RegisterPage from '@/pages/register-page'
import CartPage from '@/pages/cart-page'
import ProfilePage from '@/pages/profile-page'
import LogoutPage from '@/pages/logout-page'
import AdminHomePage from '@/pages/admin-pages/admin-home-page'
import ProductsIndex from '@/pages/admin-pages/products/index'
import ProductsForm from '@/pages/admin-pages/products/form'
import ProductsDetail from '@/pages/admin-pages/products/detail'
import CategoriesIndex from '@/pages/admin-pages/categories/index'
import CategoriesForm from '@/pages/admin-pages/categories/form'
import CategoriesDetail from '@/pages/admin-pages/categories/detail'
import OrdersIndex from '@/pages/admin-pages/orders/index'
import OrdersForm from '@/pages/admin-pages/orders/form'
import OrdersDetail from '@/pages/admin-pages/orders/detail'
import UsersIndex from '@/pages/admin-pages/users/index'
import UsersForm from '@/pages/admin-pages/users/form'
import UsersDetail from '@/pages/admin-pages/users/detail'
import SettingsIndex from '@/pages/admin-pages/settings/index'

// Definimos la estructura de navegación
const router = createBrowserRouter([
  {
    path: "/",
    Component: ClientLayout,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <AboutPage /> },
      { 
        path: "/shop",
        children:[
          { index:true, element: <ShopPage /> },
          { path:"category/:categorySlug", element: <ShopPage /> },
          { path:"search/:search", element: <ShopPage /> },
        ]
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
  {
    path:"/logout",
    element:<LogoutPage />
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, element: <AdminHomePage /> },
      { path: "products", element: <ProductsIndex /> },
      { path: "products/create", element: <ProductsForm /> },
      { path: "products/edit/:id", element: <ProductsForm /> },
      { path: "products/detail/:id", element: <ProductsDetail /> },
      { path: "categories", element: <CategoriesIndex /> },
      { path: "categories/create", element: <CategoriesForm /> },
      { path: "categories/edit/:id", element: <CategoriesForm /> },
      { path: "categories/detail/:id", element: <CategoriesDetail /> },
      { path: "orders", element: <OrdersIndex /> },
      { path: "orders/create", element: <OrdersForm /> },
      { path: "orders/edit/:id", element: <OrdersForm /> },
      { path: "orders/detail/:id", element: <OrdersDetail /> },
      { path: "users", element: <UsersIndex /> },
      { path: "users/create", element: <UsersForm /> },
      { path: "users/edit/:id", element: <UsersForm /> },
      { path: "users/detail/:id", element: <UsersDetail /> },
      { path: "settings", element: <SettingsIndex /> },
    ],
  },
])

export { router }
