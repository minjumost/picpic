import { RouterProvider } from "react-router";
import "./App.css";
import { router } from "./routers";
import GlobalStompHandler from "./providers/GlobalStompHandler";

function App() {
  return (
    <>
      <GlobalStompHandler />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
