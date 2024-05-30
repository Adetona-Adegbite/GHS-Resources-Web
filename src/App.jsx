import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Root from "./Root";
import Home from "./pages/Home";
import Create from "./pages/Create";

const router = createBrowserRouter([
  {
    index: true,
    element: <WelcomeScreen />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/main",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "create",
        element: <Create />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
