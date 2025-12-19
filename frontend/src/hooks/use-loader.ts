import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export const useBackendWakeup = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const wakeBackend = async () => {
      try {
        // 🔥 health nahi, ABOUT hi hit hoga
        await apiClient.get("/about");
      } catch (err) {
        // error aaye to bhi backend wake ho chuka hota hai
        console.log("Backend waking up...");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    wakeBackend();

    return () => {
      mounted = false;
    };
  }, []);

  return loading;
};
