import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/services/api";

// Checks once whether the backend answers. FastAPI serves /openapi.json by
// default; any HTTP response (even a 404) means the server is up. Only a
// failed request (server down, or blocked by CORS) counts as unreachable.
export function useApiStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/openapi.json`, { signal: controller.signal })
      .then(() => setStatus("online"))
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("offline");
      });
    return () => controller.abort();
  }, []);

  return status;
}
