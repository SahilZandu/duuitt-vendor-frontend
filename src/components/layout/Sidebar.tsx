import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import { ChevronDown, ChevronUp } from "lucide-react";

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
  { label: "Logout", to: "/logout" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) =>
    path ? location.pathname.startsWith(path) : false;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav className="flex flex-col space-y-2 mt-24">
        {menuItems.map((item, idx) => {
          const hasChildren = !!item.children?.length;

          return (
            <div key={idx}>
              {item.to && !hasChildren && (
                <SidebarLink to={item.to} label={item.label} active={isActive(item.to)} />
              )}

              {hasChildren && (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700 focus:outline-none ${
                      openMenus[item.label] ? "bg-gray-700" : ""
                    }`}
                  >
                    <span>{item.label}</span>
                    {/* {openMenus[item.label] ? <ChevronUp size={16} /> : <ChevronDown size={16} />} */}
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
    className={`block px-3 py-2 rounded hover:bg-gray-700 ${
      active ? "bg-gray-700 font-semibold" : ""
    }`}
  >
    {label}
  </Link>
);

export default Sidebar;
