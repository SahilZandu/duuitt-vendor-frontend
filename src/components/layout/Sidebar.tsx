import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../loader/Spinner";

type MenuItem = {
  label: string;
  to?: string;
  children?: MenuItem[];
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Profile", to: "/profile" },
  {
    label: "Settings",
    children: [
      { label: "Restaurant Profile", to: "/settings/restaurant-profile" },
      { label: "Order History", to: "/settings/order-history" },
      { label: "Manage Profile", to: "/settings/manage-profile" },
    ],
  },
  {
    label: "Management",
    children: [
      { label: "Users", to: "/management/users" },
      { label: "Permissions", to: "/management/permissions" },
    ],
  },
  { label: "Logout" }, // no 'to' — it will trigger function
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) =>
    path ? location.pathname.startsWith(path) : false;

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      document.cookie = "authToken=; Max-Age=0; path=/";
      setIsLoggingOut(false);
      navigate("/");
    }, 1000);
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 fixed top-0 left-0 z-50">
      <div className="mb-8">
        <Link to="/" className="flex items-center space-x-2 px-3">
          <div className="text-2xl font-extrabold leading-none">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              DUU
            </span>
            <span className="text-white">ITT</span>
          </div>
        </Link>
      </div>
      <nav className="flex flex-col space-y-2 mt-24">
        {menuItems.map((item, idx) => {
          const hasChildren = !!item.children?.length;

          if (item.label === "Logout") {
            return (
              <button
                key={idx}
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Spinner /> : <span>Logout</span>}
              </button>
            );
          }

          return (
            <div key={idx}>
              {item.to && !hasChildren && (
                <SidebarLink
                  to={item.to}
                  label={item.label}
                  active={isActive(item.to)}
                />
              )}

              {hasChildren && (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700 focus:outline-none ${openMenus[item.label] ? "bg-gray-700" : ""
                      }`}
                  >
                    <span>{item.label}</span>
                  </button>

                  {openMenus[item.label] && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.children!.map((subItem, subIdx) => (
                        <SidebarLink
                          key={subIdx}
                          to={subItem.to!}
                          label={subItem.label}
                          active={isActive(subItem.to)}
                        />
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, label, active }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded hover:bg-gray-700 ${active ? "bg-gray-700 font-semibold" : ""
      }`}
  >
    {label}
  </Link>
);

export default Sidebar;
