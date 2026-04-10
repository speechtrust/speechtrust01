import { createBrowserRouter } from "react-router-dom"
import HomePage from "./components/home/HomePage";
import Dashboard from "./components/dashboard/Hero";
import Interview from "./components/assessment/Interview";
import Result from "./components/assessment/result";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ProtectedRoute from "./components/commons/ProtectedRoute";

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