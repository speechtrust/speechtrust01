import { createBrowserRouter } from "react-router-dom"
import HomePage from "./components/home/HomePage";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./components/dashboard/Hero";
import Interview from "./components/assessment/Interview";
import Result from "./components/assessment/result";

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
    },
    {
        path: "/result",
        element: (
            <Result />
        )
    }
])

export default router;