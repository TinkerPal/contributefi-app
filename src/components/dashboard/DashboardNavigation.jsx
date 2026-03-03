import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD_NAV_LINKS } from "@/lib/constants";
import { GoSignOut } from "react-icons/go";
import { Link, NavLink } from "react-router";

function DashboardNavigation({
  setSheetIsOpen,
  platform = "mobile" | "desktop",
}) {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div
      className={`h-full space-y-4 px-4 ${platform === "mobile" ? "pt-8" : "pt-4"}`}
    >
      {DASHBOARD_NAV_LINKS.map((section, index) => (
        <div key={index} className="space-y-3">
          <div className="pl-6 text-[14px] font-medium text-[#525866]">
            {section.heading}
          </div>

          <ul className="">
            {section.links.map((link, idx) => (
              <li key={idx}>
                <NavLink
                  onClick={() => {
                    setSheetIsOpen(false);
                    window.scrollTo({
                      top: 0,
                    });
                  }}
                  to={
                    !isAuthenticated &&
                    (link.title === "Earnings" ||
                      link.title === "Analytics" ||
                      link.title === "Profile" ||
                      link.title === "Notifications" ||
                      link.title === "Help & Support")
                      ? "/login"
                      : link.href
                  }
                  className={({ isActive }) =>
                    isActive
                      ? "block rounded-[8px] bg-[#F0F4FD] px-6 py-3 font-medium text-[#2F0FD1]"
                      : "block px-6 py-3 text-[#8791A7] hover:text-[#2F0FD1]"
                  }
                >
                  {link.icon && (
                    <link.icon className="mr-4 inline-block text-2xl" />
                  )}
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>

          {DASHBOARD_NAV_LINKS.length > 1 &&
            index < DASHBOARD_NAV_LINKS.length - 1 && <hr className="my-2" />}
        </div>
      ))}

      {isAuthenticated ? (
        <Link
          onClick={() => {
            logout();
            setSheetIsOpen(false);
            window.scrollTo({
              top: 0,
            });
          }}
          to="/"
          className="block rounded-[8px] bg-gray-500 px-6 py-3 font-medium text-white hover:bg-gray-600"
        >
          <GoSignOut className="mr-4 inline-block text-2xl" />
          Log Out
        </Link>
      ) : (
        <Link
          to="/login"
          className="block rounded-[8px] px-6 py-3 font-medium text-[#8791A7] hover:bg-[#F0F4FD] hover:text-[#2F0FD1]"
        >
          <GoSignOut className="mr-4 inline-block text-2xl" />
          Login
        </Link>
      )}
    </div>
  );
}

export default DashboardNavigation;
