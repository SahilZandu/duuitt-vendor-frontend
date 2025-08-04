import React from "react";
import MenuIcon from "../../lib/MenuIcon";

type TabOption = {
  label: string;
  value: string;
  icon?: string; // 👈 add optional icon name
};

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <div className="flex space-x-4 md:space-x-6  border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`relative flex items-center gap-2 px-3 py-2 text-sm md:text-base font-medium transition-all duration-200 rounded-t-md
                ${
                  isActive
                    ? "text-[#8E3CF7] bg-gray-100 border-b-2 border-[#8E3CF7]"
                    : "text-gray-600 hover:text-[#8E3CF7] hover:bg-gray-50"
                }`}
            >
              {tab.icon && (
                <MenuIcon name={tab.icon} className={`w-4 h-4 ${isActive ? "text-[#8E3CF7]" : "text-gray-500"}`} />
              )}
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-[#8E3CF7] animate-fadeIn"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
