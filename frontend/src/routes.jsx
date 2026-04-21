import { createBrowserRouter } from "react-router-dom"
import HomePage from "./components/home/HomePage.jsx";
import Dashboard from "./components/dashboard/Hero.jsx";
import Interview from "./components/assessment/Interview.jsx";
import Result from "./components/assessment/Result.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import SignupPage from "./components/auth/SignupPage.jsx";
import ProtectedRoute from "./components/commons/ProtectedRoute.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <HomePage />
        )
    },
    {
        path: "/login",
        element: (
            <LoginPage />
        )
    },
    {
        path: "/signup",
        element: (
            <SignupPage />
        )
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
            <Dashboard />
            </ProtectedRoute>
        )
    },
    {
        path: "/interview",
        element: (
            <ProtectedRoute>
                <Interview />
            </ProtectedRoute>
        )
    },
    {
        path: "/result/:id",    
        element: (
            <ProtectedRoute>
                <Result />
            </ProtectedRoute>
        )
    }
])

export default router;