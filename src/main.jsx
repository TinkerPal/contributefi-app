import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Communities from "./pages/dashboard/Communities";
import Tasks from "./pages/dashboard/Tasks";
import NotFound from "./components/NotFound";
import AuthLayout from "./components/auth/AuthLayout";
import CreateAccount from "./pages/get-started/CreateAccount";
import VerifyEmail from "./pages/get-started/VerifyEmail";
import Username from "./pages/get-started/Username";
import Login from "./pages/login/Login";
import AccountConfiguration from "./pages/get-started/AccountConfiguration";
import { ToastContainer } from "react-toastify";
import ReactQueryProviders from "./components/ReactQueryProviders";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import CommunityDetailsPage from "./pages/dashboard/CommunityDetailsPage";
import TaskDetailsPage from "./pages/dashboard/TaskDetailsPage";
import GoogleCallback from "./components/GoogleCallback";
import BindEmail from "./pages/get-started/BindEmail";
import CreateWallet from "./pages/get-started/CreateWallet";

const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Overview },
      { path: "communities", Component: Communities },
      { path: "communities/:communityAlias", Component: CommunityDetailsPage },
      {
        path: "communities/:communityAlias/:taskId",
        Component: TaskDetailsPage,
      },
      { path: "tasks", Component: Tasks },
      { path: "tasks/:taskId", Component: TaskDetailsPage },
      { path: "earnings", element: <></> },
      { path: "analytics", element: <></> },
      { path: "profile", element: <></> },
      { path: "notifications", element: <></> },
      { path: "help", element: <></> },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "get-started",
    Component: AuthLayout,
    children: [
      { index: true, Component: CreateAccount },
      { path: "verify-email", Component: VerifyEmail },
      { path: "username", Component: Username },
      { path: "bind-email", Component: BindEmail },
      { path: "create-wallet", Component: CreateWallet },
      { path: "account-configuration", Component: AccountConfiguration },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-red-500">
              404 – Page Not Found
            </h1>
          </div>
        ),
      },
    ],
  },
  {
    path: "login",
    Component: AuthLayout,
    children: [
      { index: true, Component: Login },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-red-500">
              404 – Page Not Found
            </h1>
          </div>
        ),
      },
    ],
  },
  {
    path: "google",
    Component: AuthLayout,
    children: [
      { index: true, Component: GoogleCallback },

      {
        path: "*",
        element: (
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-red-500">
              404 – Page Not Found
            </h1>
          </div>
        ),
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<>Loading....</>} persistor={persistor}>
        <ReactQueryProviders>
          <RouterProvider router={router} />
          <ToastContainer />
        </ReactQueryProviders>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
