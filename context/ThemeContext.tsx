import themes from "@/lib/themes";
import { Theme, ThemeContextType } from "@/types";
import React, { createContext, useState, ReactNode, useContext } from "react";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

type ThemeProviderProps = {
  children: ReactNode;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.dark);

  const switchTheme = (themeName: keyof typeof themes) => {
    setCurrentTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
