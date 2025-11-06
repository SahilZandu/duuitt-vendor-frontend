import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "../../lib/MenuIcon";
import Cookies from "js-cookie";
import Spinner from "../loader/Spinner";
import logo from "../../assets/images/logo.png";
import axiosInstance from "../../api/apiInstance";
import { toast } from "react-toastify";
import { useSidebar } from "../../lib/Context/SidebarContext";
import Tooltip from "../Ui/Tooltip";

type MenuItem = {
  label: string;
  to?: string;
  icon?: string;
  children?: MenuItem[];
};

const topMenuItems: MenuItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
  { label: "Orders", to: "/orders", icon: "order" },
  { label: "Team Members", to: "/team", icon: "team" },
  { label: "Food Menu", to: "/food-menu", icon: "food" },
  {
    label: "Outlet Info",
    to: "/outlet",
    icon: "outlet",
    children: [
      { label: "Restaurant Profile", to: "/outlet/restaurant-profile", icon: "restaurant-profile" },
      { label: "Order History", to: "/outlet/order-history", icon: "order-history" },
      { label: "Rating", to: "/outlet/rating", icon: "rating" },
      { label: "Payment Logs", to: "/outlet/payment-logs", icon: "payment" },
    ],
  },
  { label: "Offers", to: "/offers", icon: "offers" },
  { label: "Timing", to: "/timings", icon: "time" },
  { label: "KYC Documents", to: "/kyc-documents", icon: "document" },
  { label: "Pending Payouts", to: "/pending-payouts", icon: "pending" },
  { label: "Settled Payments", to: "/settled-payment-list", icon: "settled-report" },
];

const bottomMenuItems: MenuItem[] = [
  { label: "Settings", to: "/setting/manage-profile", icon: "settings" },
  // { label: "Get Help", to: "/help", icon: "help" },
  { label: "Sign out", to: "/logout", icon: "logout" },
];

const Sidebar: React.FC = () => {
  const {
    isCollapsed,
    toggleSidebar,
    openMenus,
    toggleMenu,
    isActive,
  } = useSidebar();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [restaurantName, setRestaurantName] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const restaurant = localStorage.getItem("restaurant_name");
    if (restaurant) setRestaurantName(restaurant);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await axiosInstance("get", "/vendor/logout");
      console.log("response", response);
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isKycCompleted");
        localStorage.removeItem("restaurant_name");
        localStorage.removeItem("vendor_id");
        localStorage.removeItem("restaurant_id");
        Cookies.remove("authToken");

        setIsLoggingOut(false);
        navigate("/login");
      }, 1000);
      toast.success(response?.data?.message || "");
    } catch (error) {
      console.error("Failed to update offer status", error);
    }
  };
  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-[#8E3CF7] text-white h-screen fixed left-0 top-0 
      flex flex-col py-6 px-3 transition-all duration-300 z-50`}
    >
      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-3 bg-white text-[#8E3CF7]
        p-1 rounded-full shadow-md hover:scale-105 transition"
      >
        {isCollapsed ? ">" : "<"}
      </button>

      {/* Logo */}
      <Link className="flex justify-center mb-6 mt-1" to="/">
        <img
          src={logo}
          alt="Logo"
          className={`${isCollapsed ? "w-10" : "w-20"} transition`}
        />
      </Link>

      {/* Restaurant Name */}
      {!isCollapsed && restaurantName && (
        <div className="flex gap-2 items-center bg-white/20 py-2 px-3 rounded-md mb-6">
          <span className="bg-white text-[#8E3CF7] rounded-full w-8 h-8 
          flex justify-center items-center font-bold">
            {restaurantName.charAt(0)}
          </span>
          <span className="text-sm truncate">{restaurantName}</span>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {[...topMenuItems, ...bottomMenuItems].map((item, index) => {
          const hasChildren = item.children?.length;

          return (
            <div key={index}>
              {/* Parent with submenu */}
              {hasChildren && (
                <>
                
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`flex items-center w-full  py-2 rounded-lg transition ${
                      isCollapsed ? "justify-center" : "px-3 gap-3 justify-between"
                    } ${
                      openMenus[item.label]
                        ? "bg-white text-[#8E3CF7]"
                        : "hover:bg-white hover:text-[#8E3CF7]"
                    }`}
                  >
                    <div className="flex items-center justify-center!important space-x-2">
                      {item.icon && <MenuIcon name={item.icon} />}
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed &&
                    <MenuIcon
                      name={openMenus[item.label] ? "dropdown-up" : "dropdown"}
                    />}
                  </button>

                  {!isCollapsed && openMenus[item.label] && (
                    <ul className="ml-7 mt-1 space-y-1">
                      {item.children?.map((child, subIndex) => (
                        <Link
                          key={subIndex}
                          to={child.to!}
                          className={`flex items-center py-1 transition ${
                            isActive(child.to!)
                              ? "text-white font-bold"
                              : "opacity-80 hover:opacity-100"
                          }`}
                        >
                          <MenuIcon name={child.icon!} />
                          <span className="ml-2 text-sm">{child.label}</span>
                        </Link>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {/* Direct Link Items */}

            {!hasChildren && item.label !== "Sign out" && (
              isCollapsed ? (
                <Tooltip text={item.label} position="right">
                  <Link
                    to={item.to!}
                    className={`flex items-center py-2 rounded-lg transition ${
                      isCollapsed ? "justify-center" : "px-3 gap-3"
                    } ${
                      isActive(item.to!)
                        ? "bg-white text-[#8E3CF7]"
                        : "hover:bg-white hover:text-[#8E3CF7]"
                    }`}
                  >
                    <MenuIcon name={item.icon!} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </Tooltip>
              ) : (
                <Link
                  to={item.to!}
                  className={`flex items-center py-2 rounded-lg transition ${
                    isCollapsed ? "justify-center" : "px-3 gap-3"
                  } ${
                    isActive(item.to!)
                      ? "bg-white text-[#8E3CF7]"
                      : "hover:bg-white hover:text-[#8E3CF7]"
                  }`}
                >
                  <MenuIcon name={item.icon!} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )
            )}
            
                
            

              {/* Logout */}
              {item.label === "Sign out" && (
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center py-2 rounded-lg transition ${
                    isCollapsed ? "justify-center" : "px-3 gap-3"
                  } hover:bg-white hover:text-[#8E3CF7]`}
                >
                  <MenuIcon name={item.icon!} />
                  {!isCollapsed && (
                    <span>{isLoggingOut ? <Spinner /> : "Sign out"}</span>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

