import { useSyncExternalStore } from "react";

function subscribeConnectivity(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function useConnectivity(): boolean {
  return useSyncExternalStore(
    subscribeConnectivity,
    () => navigator.onLine,
    () => true
  );
}
