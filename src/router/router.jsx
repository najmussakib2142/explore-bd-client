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
import TourismSection from "../pages/Home/TourismSection/TourismSection";
import TouristStorySection from "../pages/Home/TouristStorySection/TouristStorySection";
import AddStory from "../pages/Dashboard/AddStory/AddStory";
import CommunityPage from "../pages/CommunityPage/CommunityPage";
import ErrorPage from "../pages/shared/ErrorPage/ErrorPage";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import GuidesList from "../pages/PackageDetailsPage/GuidesList";
import AllPackages from "../pages/AllPackages/AllPackages";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import AssignGuide from "../pages/Dashboard/AssignGuide/AssignGuide";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import MyAssignedTours from "../pages/Dashboard/MyAssignedTours/MyAssignedTours";
import ManageStories from "../pages/Dashboard/GuideDashboard/ManageStories/ManageStories";
import EditStoryPage from "../pages/Dashboard/GuideDashboard/ManageStories/EditStoryPage";

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
                element: <PackageDetailsPage></PackageDetailsPage>
            },
            {
                path: 'bookingForm',
                element: <BookingForm></BookingForm>
            },
            {
                path: 'guidesList',
                Component: <GuidesList></GuidesList>
            },
            {
                path: "/guides/:id",
                element: <GuideProfilePage></GuideProfilePage>
            },
            {
                path: 'touristStorySection',
                Component: TouristStorySection,
            },
            {
                path: 'communityPage',
                Component: CommunityPage,
            },
            {
                path: 'allTrips',
                Component: AllPackages,
            },
            {
                path: 'forbidden',
                element: <Forbidden></Forbidden>
            }
        ]
    },
    {
        path: "*",
        element: <ErrorPage></ErrorPage>
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
                element: <AdminRoute><AddPackage></AddPackage></AdminRoute>,
            },
            {
                path: 'pendingGuides',
                element: <AdminRoute><PendingGuides></PendingGuides></AdminRoute>
            },

            {
                path: 'active-guides',
                element: <AdminRoute><ActiveGuides></ActiveGuides></AdminRoute>
            },
            {
                path: "makeAdmin",
                element: <AdminRoute><MakeAdmin></MakeAdmin></AdminRoute>
            },
            {
                path: "manage-users",
                element: <ManageUsers></ManageUsers>
            },
            {
                path: "assign-guide",
                element: <AdminRoute><AssignGuide></AssignGuide></AdminRoute>
            },
            {
                path: 'payment/:packageId/:bookingId',
                Component: Payment,
            },
            {
                path: 'beAGuide',
                element: <BeAGuide></BeAGuide>
            },
            {
                path: "addStory",
                Component: AddStory
            },
            {
                path: "myAssignedTours",
                element: <MyAssignedTours></MyAssignedTours>
            },
            {
                path: "manageStories",
                element: <ManageStories></ManageStories>
            },
            {
                path: '/dashboard/editStoryPage/:id',
                element: <EditStoryPage />
            },
            {
                path: "paymentHistory",
                Component: PaymentHistory,
            },
            {
                path: 'myBookings',
                element: <MyBookings></MyBookings>
            },

        ]
    }
]);