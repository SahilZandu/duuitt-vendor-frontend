import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./utils/firebase";
import { toast } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import { useVendor } from "./lib/Context/VendorContext";

const App = () => {
  const { fetchVendor } = useVendor();
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const { title, body } = payload.notification || {};
      console.log('messaging:', messaging);
      if (Notification.permission === "granted") {
        new Notification(title || "New Notification", {
          body: body || "",
          icon: "/firebase-logo.png", // optional icon path
        });
      } else {
        toast.info(`${title || "Notification"}: ${body || ""}`);
      }

      // Refetch vendor data so UI reflects latest server state (e.g., KYC status)
      fetchVendor();
    });
  }, []);

  return <AppRoutes />;
};

export default App;
