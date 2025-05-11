import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);
