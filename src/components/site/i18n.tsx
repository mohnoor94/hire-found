import { createContext, useContext } from "react";
import type { Messages } from "@/i18n/en";
import { en as defaultMessages } from "@/i18n/en";

export const I18nContext = createContext<Messages>(defaultMessages);

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({
  messages,
  children,
}: {
  messages: Messages;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={messages}>{children}</I18nContext.Provider>
  );
}

