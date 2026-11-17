import { createContext, useCallback, useEffect, useMemo, useState } from "react";

// Real request history, kept in this browser's localStorage. Context lets the
// MetaProbe page add entries and the Overview page read them without passing
// props through every component in between.

const STORAGE_KEY = "urlprobe.activity.v1";
const MAX_ENTRIES = 8;

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode, quota): history just won't persist
    }
  }, [items]);

  const add = useCallback((entry) => {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: Date.now(),
      ...entry,
    };
    setItems((previous) => [item, ...previous].slice(0, MAX_ENTRIES));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, add, clear }), [items, add, clear]);
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}
