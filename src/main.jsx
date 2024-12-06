import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import MainPage from "./components/MainPage.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import NotFoundScreen from "./components/NotFoundScreen.jsx";
import RegisterScreen from "./components/RegisterScreen.jsx";
import CollectionPage, { loader as collectionPageLoader } from "./components/CollectionPage.jsx";
import SearchPage, { loader as searchPageLoader } from "./components/SearchPage.jsx";
import Cart from "./components/Cart.jsx";
import Admin from "./components/Admin.jsx";
import { Provider } from "react-redux";
import store from "./redux_store.js";
import ManageProduct from "./components/ManageProduct.jsx";
import AdminProductDetail from "./components/AdminProductDetail.jsx";
import AddProduct from "./components/AddProduct.jsx";
import ManagePromotion from "./components/ManagePromotion.jsx";
import Profile from "./components/ProfileScreen.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import AdminOrderManagement from "./components/AdminOrderManagement.jsx";
import ReportsScreen from "./components/ReportsScreen.jsx";
import ManageVoucher from "./components/ManageVoucher.jsx";
import Order from "./components/Order.jsx"
import AdminSupport from "./components/AdminSupport.jsx";
import AuthRedirectPage from "./components/AuthRedirectPage.jsx";
import CustomerSupport from "./components/CustomerSupport.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <MainPage />,
            },
            {
                path: "collections/:collectionName",
                element: <CollectionPage />,
                loader: collectionPageLoader,
            },
            // payment screen
            {
                path: "cart/payment",
            },
            // view cart
            {
                path: "cart",
                element: <Cart />,
            },
            // view product detail
            {
                path: "product/:productId",
                element: <ProductDetail />,
            },
            {
                path: "login",
                element: <LoginScreen />,
            },
            {
                path: "register",
                element: <RegisterScreen />,
            },
            {
                path: "my-orders",
                element: <Order />,
            },
            {
                path: "search",
                element: <SearchPage />,
                loader: searchPageLoader,
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "*",
                element: <NotFoundScreen />, // Route 404
            },
            {
                path: "auth", 
                element: <AuthRedirectPage />,  
            },
            {
                path: "supports", 
                element: <CustomerSupport />,  
            },
        ],
    },
    {
        path: "/admin",
        element: <Admin />,
        children: [
            {
                path: "products/add-product",
                element: <AddProduct />,
            },
            {
                path: "products/:id",
                element: <AdminProductDetail />,
            },
            {
                path: "products",
                element: <ManageProduct />,
            },

            {
                path: "promotions",
                element: <ManagePromotion />,
            },
            {
                path: "vouchers",
                element: <ManageVoucher />,
            },
            {
                path: "reports",
                element: <ReportsScreen/>,
            },
            {
                path: "orders",
                element: <AdminOrderManagement />,
            },
            {
                path: "customer-supports",
                element: <AdminSupport></AdminSupport>
            },
            {
                path: "*",
                element: <NotFoundScreen />, // Route 404
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}></RouterProvider>
        </Provider>
    </StrictMode>
);
