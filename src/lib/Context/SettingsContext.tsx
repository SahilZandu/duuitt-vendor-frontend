// src/context/SettingsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../../api/apiInstance";

// Define shape of your settings (extend as per API response)
export interface Settings {
  terms_and_conditions?: string;
  privacy_policy?: string;
  [key: string]: any;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance("get", "/about?type=vendor");
      setSettings(response.data?.data || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// ✅ Custom hook for easy usage
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
