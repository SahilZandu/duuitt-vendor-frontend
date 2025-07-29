import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "../../lib/MenuIcon";
import Cookies from "js-cookie"; // Make sure you have this installed: `npm install js-cookie`
import Spinner from "../loader/Spinner";
import logo from "../../assets/images/logo.svg";

type MenuItem = {
  label: string;
  to?: string;
  icon?: string;
  children?: MenuItem[];
};

const topMenuItems: MenuItem[] = [
  { label: "Home", to: "/dashboard", icon: "home" },
  { label: "Orders", to: "/orders", icon: "order" },
  { label: "Team Members", to: "/team", icon: "team" },
  {
    label: "Outlet Info", to: "/outlet", icon: "outlet", children: [
      { label: "Restaurant Profile", to: "/outlet/restaurant-profile", icon: "restaurant" },
      { label: "Order History", to: "/outlet/order-history", icon: "order" },
      { label: "Manage Profile", to: "/outlet/manage-profile", icon: "manage" },
    ],
  },
  { label: "Messages", to: "/messages", icon: "message" },
  { label: "Offers", to: "/offers", icon: "offer" },
  { label: "KYC Documents", to: "/kyc", icon: "kyc" },
  { label: "Reports", to: "/reports", icon: "report" },
];

const bottomMenuItems: MenuItem[] = [
  { label: "Settings", icon: "settings", to: "/setting" },
  { label: "Get Help", to: "/help", icon: "help" },
  { label: "Sign out", to: "/logout", icon: "logout" }, // this will be handled manually
];


const Sidebar: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialOpenMenus = () => {
    const openState: Record<string, boolean> = {};
    [...topMenuItems, ...bottomMenuItems].forEach((item) => {
      if (item.children?.length) {
        const hasActiveChild = item.children.some((child) =>
          location.pathname.startsWith(child.to || "")
        );
        openState[item.label] = hasActiveChild;
      }
    });
    return openState;
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(getInitialOpenMenus);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) =>
    path ? location.pathname.startsWith(path) : false;

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isKycCompleted");
      localStorage.removeItem("vendor_id");
      Cookies.remove("authToken");

      setIsLoggingOut(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <aside className="w-64 bg-[#8E3CF7] text-white min-h-screen flex flex-col justify-between py-6 px-4">
      <nav className="space-y-2">
        <a href="/" className="mb-8 cursor-pointer">
          <img
            src={logo}
            alt="Logo"
            className="h-[120px] w-[200px]"
          />
        </a>

        {topMenuItems.map((item, idx) => {
          const hasChildren = !!item.children?.length;
          return (
            <div key={idx}>
              {item.to && !hasChildren && (
                <SidebarLink
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  active={isActive(item.to)}
                />
              )}

              {hasChildren && (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#7b2de6] focus:outline-none ${openMenus[item.label] ? "bg-[#7b2de6]" : ""
                      }`}
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon && <MenuIcon name={item.icon} />}
                      <span>{item.label}</span>
                    </div>
                    <MenuIcon name={openMenus[item.label] ? "dropdown-up" : "dropdown"} />
                  </button>
                  {openMenus[item.label] && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item?.children?.map((subItem, subIdx) => (
                        <SidebarLink
                          key={subIdx}
                          to={subItem.to!}
                          label={subItem.label}
                          icon={subItem.icon}
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

      <div className="space-y-2">
        {bottomMenuItems.map((item, idx) => {
          const hasChildren = !!item.children?.length;

          // Handle "Sign out" separately
          if (item.label === "Sign out") {
            return (
              <button
                key={idx}
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-[#7b2de6]"
              >
                {item.icon && <MenuIcon name={item.icon} />}
                {isLoggingOut ? <Spinner /> : <span>{item.label}</span>}
              </button>
            );
          }

          return (
            <div key={idx}>
              {item.to && !hasChildren && (
                <SidebarLink
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  active={isActive(item.to)}
                />
              )}
              {hasChildren && (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#7b2de6] focus:outline-none ${openMenus[item.label] ? "bg-[#7b2de6]" : ""
                      }`}
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon && <MenuIcon name={item.icon} />}
                      <span>{item.label}</span>
                    </div>
                    <MenuIcon name={openMenus[item.label] ? "dropdown-up" : "dropdown"} />
                  </button>
                  {openMenus[item.label] && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item?.children?.map((subItem, subIdx) => (
                        <SidebarLink
                          key={subIdx}
                          to={subItem.to!}
                          label={subItem.label}
                          icon={subItem.icon}
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
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  label: string;
  icon?: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, label, icon, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-3 py-2 rounded hover:bg-[#7b2de6] ${active ? "bg-[#7b2de6] font-semibold" : ""
      }`}
  >
    {icon && <MenuIcon name={icon} />}
    <span>{label}</span>
  </Link>
);

export default Sidebar;
