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
import GetStartedLayout from "./components/get-started/GetStartedLayout";
import CreateAccount from "./pages/get-started/CreateAccount";
import VerifyEmail from "./pages/get-started/VerifyEmail";
import Username from "./pages/get-started/Username";
import Login from "./pages/login/Login";
import AccountConfiguration from "./pages/get-started/AccountConfiguration";
import { ToastContainer } from "react-toastify";
import ReactQueryProviders from "./components/providers";
import { AuthProvider } from "./contexts/AuthContext";
import { WalletContextProvider } from "./contexts/WalletContext";
import CommunityDetailsPage from "./pages/dashboard/CommunityDetailsPage";
import TaskDetailsPage from "./pages/dashboard/TaskDetailsPage";
import { WagmiContextProvider } from "./contexts/WagmiContext";
import { WagmiProvider } from "wagmi";
// import { config } from "./lib/wagmiConfig";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import GoogleCallback from "./components/GoogleCallback";

const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Overview },
      // { path: "overview", Component: Overview },
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
    Component: GetStartedLayout,
    children: [
      { index: true, Component: CreateAccount },
      { path: "verify-email", Component: VerifyEmail },
      { path: "username", Component: Username },
      { path: "account-configuration", Component: AccountConfiguration },
    ],
  },
  {
    path: "login",
    Component: GetStartedLayout,
    children: [{ index: true, Component: Login }],
  },
  {
    path: "google",
    Component: GetStartedLayout,
    children: [{ index: true, Component: GoogleCallback }],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Wagmi> */}
    <ReactQueryProviders>
      <AuthProvider>
        <WalletContextProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </WalletContextProvider>
      </AuthProvider>
    </ReactQueryProviders>
    {/* </Wagmi> */}
  </StrictMode>,
);
