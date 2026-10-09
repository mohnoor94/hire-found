"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ServiceAudience = "employers" | "candidates";

type ServicesTabContextValue = {
  tab: ServiceAudience;
  setTab: (tab: ServiceAudience) => void;
};

const ServicesTabContext = createContext<ServicesTabContextValue | null>(null);

export function ServicesTabProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<ServiceAudience>("employers");
  const value = useMemo(() => ({ tab, setTab }), [tab]);
  return (
    <ServicesTabContext.Provider value={value}>
      {children}
    </ServicesTabContext.Provider>
  );
}

/** Null when the homepage provider is absent (jobs and isolated tests). */
export function useServicesTab() {
  return useContext(ServicesTabContext);
}
