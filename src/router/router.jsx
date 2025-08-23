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
import PackageDetailsPage from "../pages/PackageDetailsPage/PackageDetailsPage";
import PrivateRoute from "../routes/PrivateRoute";
import BookingForm from "../pages/PackageDetailsPage/BookingForm";
import BeAGuide from "../pages/Dashboard/DashboardHome/BeAGuide";
import PendingGuides from "../pages/Dashboard/PendingGuides/PendingGuides";
import GuideProfilePage from "../pages/shared/GuideProfilePage/GuideProfilePage";
import MyBookings from "../pages/Dashboard/TouristDashboard/MyBookings/MyBookings";
import ActiveGuides from "../pages/Dashboard/ActiveGuides/ActiveGuides";
import Payment from "../pages/Dashboard/Payment/Payment";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "packageDetailsPage/:id",
                element: <PrivateRoute><PackageDetailsPage></PackageDetailsPage></PrivateRoute>
            },
            {
                path: 'bookingForm',
                element: <BookingForm></BookingForm>
            },
            {
                path: '/guides/:id',
                element: <GuideProfilePage></GuideProfilePage>
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
        element: <PrivateRoute><DashBoardLayout></DashBoardLayout></PrivateRoute>,
        children: [
            {
                index: true,
                Component: DashboardHome,
            },
            {
                path: 'addPackage',
                Component: AddPackage,
            },
            {
                path: 'beAGuide',
                element: <BeAGuide></BeAGuide>
            },
            {
                path: 'pendingGuides',
                element: <PendingGuides></PendingGuides>
            },
            {
                path: 'myBookings',
                element: <MyBookings></MyBookings>
            },
            {
                path: 'active-guides',
                element: <ActiveGuides></ActiveGuides>
            },
            {
                path: 'payment/:packageId/:bookingId',
                Component: Payment,
            }
        ]
    }
]);