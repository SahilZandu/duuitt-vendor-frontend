import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./utils/firebase";
import { toast } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import { useVendor } from "./lib/Context/VendorContext";
import { fetchRestaurantDetails } from "./api/ProfileUpdateApi";
const App = () => {
  const { fetchVendor } = useVendor();
  const restaurant_id = localStorage.getItem("restaurant_id") || '';
  if(!restaurant_id){
    console.error('resturant id is not found in local storage');
  }
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
      fetchVendor();
      fetchRestaurantDetails(restaurant_id);
    });
  }, []);

  return <AppRoutes />;
};

export default App;
