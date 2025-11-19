import MenuIcon from "../../lib/MenuIcon";

export type TabOption<T extends string> = {
  label: string;
  value: T;
  icon?: string;
};

export interface TabsProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

function Tabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabsProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab: TabOption<T>) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 py-4 text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap flex-1 min-w-max
                ${
                  isActive
                    ? "text-white bg-gradient-to-r from-[#8E3CF7] to-[#A855F7] shadow-lg"
                    : "text-gray-600 hover:text-[#8E3CF7] hover:bg-purple-50"
                }`}
            >
              {tab.icon && (
                <MenuIcon
                  name={tab.icon}
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                />
              )}
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 animate-fadeIn"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
