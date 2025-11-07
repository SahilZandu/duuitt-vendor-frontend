import  { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  openMenus: Record<string, boolean>;
  setOpenMenus: Dispatch<SetStateAction<Record<string, boolean>>>;
  toggleMenu: (menu: string) => void;
  isActive: (path: string) => boolean;
  handleLogout: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Toggle Sidebar
  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  // ✅ Expand / Collapse Sub-menu
  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // ✅ Active Route Highlight
  const isActive = (path: string) => location.pathname === path;

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // (optional)
    navigate("/login"); // redirect to login page
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        openMenus,
        setOpenMenus,
        toggleMenu,
        isActive,
        handleLogout,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};
