import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./utils/firebase";
import { toast } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const { title, body } = payload.notification || {};

      if (Notification.permission === "granted") {
        new Notification(title || "New Notification", {
          body: body || "",
          icon: "/firebase-logo.png", // optional icon path
        });
      } else {
        toast.info(`${title || "Notification"}: ${body || ""}`);
      }
    });
  }, []);

  return <AppRoutes />;
};

export default App;
