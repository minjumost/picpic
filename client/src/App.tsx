import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import MainPage from "./pages/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/main",
    element: <MainPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
