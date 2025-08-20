import {
    createBrowserRouter
} from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import DashBoardLayout from "../layouts/DashBoardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import AddPackage from "../pages/Dashboard/AddPackage/AddPackage";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home,
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    },
    {
        path: '/dashboard',
        element: <DashBoardLayout></DashBoardLayout>,
        children: [
            {
                index: true,
                Component: DashboardHome,
            },
            {
                path: 'addPackage',
                Component: AddPackage,
            }
        ]
    }
]);