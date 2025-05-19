import { RouterProvider } from "react-router";
import "./App.css";
import { router } from "./routers";
import GA4Initializer from "./GA4Initializer";

function App() {
  return (
    <>
      <GA4Initializer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
