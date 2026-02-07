import { createBrowserRouter } from "react-router-dom"
import HomePage from "./components/home/HomePage";
import AuthPage from "./components/auth/AuthPage";

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
])

export default router;