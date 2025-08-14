import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import type { ReactNode } from "react";
import apiRequest from "../../api/apiInstance";

// Define the structure of individual timing entries
// types.ts or inside your context file

export interface TimeSlotEntry {
    open_times: string;
    close_time: string;
    days_of_week: number;
    is_edit_delete: boolean;
    _id?: string;
}

export interface TimingGroup {
    outlet_status: boolean;
    timings: TimeSlotEntry[];
}

export interface RestaurantTimings {
    is_all_day: boolean;
    all_days: TimingGroup;
    specified: TimingGroup[];
}

// Structure of the nested restaurant object
interface Restaurant {
    timings: RestaurantTimings;
    name: string;
    // Add any other restaurant fields here if needed
}
interface BankDetail {
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    status: string;
}

interface FssaiDetail {
    fssai_number: string;
    expiry_date: string;
    status: string;
}

interface GstnDetail {
    gstn_number: string;
    expiration_date: string;
    status: string;
}

interface PanDetail {
    pan_number: string;
    status: string;
}
// Vendor type with nested restaurant
interface Vendor {
    restaurant_id: string;
    restaurant_name: string;
    restaurant?: Restaurant;
    bank_detail?: BankDetail;
    fssai_detail?: FssaiDetail;
    gstn_detail?: GstnDetail;
    pan_detail?: PanDetail;
}

// Context type
interface VendorContextType {
    vendor: Vendor | null;
    loading: boolean;
    setVendor: (vendor: Vendor) => void;
    fetchVendor: () => Promise<Vendor | undefined>;
}

// Create context
const VendorContext = createContext<VendorContextType | undefined>(undefined);

// Custom hook to access the context
export const useVendor = (): VendorContextType => {
    const context = useContext(VendorContext);
    if (!context) {
        throw new Error("useVendor must be used within a VendorProvider");
    }
    return context;
};

// Provider component
export const VendorProvider = ({ children }: { children: ReactNode }) => {
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchVendor = async (): Promise<Vendor | undefined> => {
        setLoading(true);
        try {
            const vendor_id = localStorage.getItem("vendor_id");
            if (!vendor_id) {
                console.warn("No vendor ID found in localStorage");
                return;
            }

            const response = await apiRequest("post", "/vendor/get", { vendor_id });
            const vendorData = response?.data?.data as Vendor;
            setVendor(vendorData);
            return vendorData;
        } catch (err) {
            console.error("Failed to fetch vendor", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!vendor) {
            fetchVendor();
        }
    }, []);

    return (
        <VendorContext.Provider value={{ vendor, loading, setVendor, fetchVendor }}>
            {children}
        </VendorContext.Provider>
    );
};
