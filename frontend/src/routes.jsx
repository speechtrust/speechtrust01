import { createBrowserRouter } from "react-router-dom"
import HomePage from "./components/home/HomePage";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./components/dashboard/Hero";
import Interview from "./components/assessment/Interview";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <HomePage />
        )
    },
    {
        path: "/auth",
        element: (
            <AuthPage />
        )
    },
    {
        path: "/dashboard",
        element: (
            <Dashboard />
        )
    },
    {
        path: "/interview",
        element: (
            <Interview />
        )
    }
])

export default router;