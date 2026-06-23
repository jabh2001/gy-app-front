import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '@/components/own/layouts/client-layout'
import AdminLayout from '@/components/own/layouts/admin-layout'
import HomePage from '@/pages/home-page'
import AboutPage from './pages/about-page'
import ContactPage from './pages/contact-page'
import ShopPage from './pages/shop-page'
import LoginPage from '@/pages/login-page'
import RegisterPage from '@/pages/register-page'
import LogoutPage from '@/pages/logout-page'

const ProductDetailPage = lazy(() => import('@/pages/product-detail-page'))
const CartPage = lazy(() => import('@/pages/cart-page'))
const OrderDetailPage = lazy(() => import('@/pages/order-detail-page'))
const ProfilePage = lazy(() => import('@/pages/profile-page'))
const OrdersPage = lazy(() => import('@/pages/orders-page'))


const AdminHomePage = lazy(() => import('@/pages/admin-pages/admin-home-page'))
const ProductsIndex = lazy(() => import('@/pages/admin-pages/products/index'))
const ProductsForm = lazy(() => import('@/pages/admin-pages/products/form'))
const ProductsDetail = lazy(() => import('@/pages/admin-pages/products/detail'))
const CategoriesIndex = lazy(() => import('@/pages/admin-pages/categories/index'))
const CategoriesForm = lazy(() => import('@/pages/admin-pages/categories/form'))
const CategoriesDetail = lazy(() => import('@/pages/admin-pages/categories/detail'))
const OrdersIndex = lazy(() => import('@/pages/admin-pages/orders/index'))
const OrdersForm = lazy(() => import('@/pages/admin-pages/orders/form'))
const OrdersDetail = lazy(() => import('@/pages/admin-pages/orders/detail'))
const UsersIndex = lazy(() => import('@/pages/admin-pages/users/index'))
const UsersForm = lazy(() => import('@/pages/admin-pages/users/form'))
const UsersDetail = lazy(() => import('@/pages/admin-pages/users/detail'))
const SettingsIndex = lazy(() => import('@/pages/admin-pages/settings/index'))

const router = createBrowserRouter([
  {
    path: "/",
    Component: ClientLayout,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      {
        path: "/shop",
        children:[
          { index:true, element: <ShopPage /> },
          { path:"category/:categorySlug", element: <ShopPage /> },
          { path:"search/:search", element: <ShopPage /> },
          { path:"product/:id", element: <ProductDetailPage /> },
        ]
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/orders/:id", element: <OrderDetailPage /> },
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
