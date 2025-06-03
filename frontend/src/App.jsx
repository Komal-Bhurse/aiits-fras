
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';
import WebTheme from "./themes/web-theme"
import AdminTheme from "./themes/admin-theme"
import ErrorPage from "./pages/error-page"
import Attendence from "./pages/attendance"
import UserRegister from "./pages/user-register"
import AdminDashboard from "./pages/admin/dashboard"
import Users from "./pages/admin/users"
import PresentUsers from "./pages/admin/present-users"
import UbsentUsers from "./pages/admin/absent-users"
import HomePage from "./pages/home"


function App() {

  const router = createBrowserRouter([

    {
      element: <WebTheme />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage/>
        },
        {
          path: "/mark-attendance",
          element: <Attendence/>
        },
       
      ]
    },
     {
      element: <AdminTheme />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/admin/dashboard",
          element: <AdminDashboard/>
        },
         {
          path: "/admin/user-register",
          element: <UserRegister/>
        },
        {
          path: "/admin/users",
          element: <Users/>
        },
        {
          path: "/admin/present-users",
          element: <PresentUsers/>
        },
        {
          path: "/admin/absent-users",
          element: <UbsentUsers/>
        },
      ]
    },
  ]);

  return (
    <>
    <RouterProvider router={router} />
    <Toaster/>
    </>
  )
}

export default App