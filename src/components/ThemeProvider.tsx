"use client";

import { useSession } from "next-auth/react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const themeData = (session?.user as any)?.themeData;

  if (!themeData) {
    return <>{children}</>;
  }

  return (
    <>
      <style>{`
        :root {
          /* Deep Theming Overrides */
          --theme-app-bg: ${themeData.appBackground || "linear-gradient(180deg, #082f49 0%, #041e30 100%)"} !important;
          --theme-panel-bg: ${themeData.panelBackground || "var(--color-wood-800)"} !important;
          --theme-border: ${themeData.borderStyle || "2px solid var(--color-treasure-400)"} !important;
          --theme-font: ${themeData.fontFamily || "var(--font-serif)"} !important;
          --theme-emblem: url('${themeData.emblemUrl || ""}') !important;
          
          /* Fallback Base Colors */
          --color-ocean-950: color-mix(in srgb, ${themeData.primary} 80%, black) !important;
          --color-ocean-900: ${themeData.primary} !important;
          --color-ocean-800: color-mix(in srgb, ${themeData.primary} 80%, white) !important;
          
          --color-ocean-700: ${themeData.secondary} !important;
          --color-ocean-600: ${themeData.secondary} !important;
          --color-ocean-500: color-mix(in srgb, ${themeData.secondary} 80%, white) !important;
          
          --color-treasure-600: color-mix(in srgb, ${themeData.accent} 80%, black) !important;
          --color-treasure-500: ${themeData.accent} !important;
          --color-treasure-400: ${themeData.accent} !important;
          --color-treasure-300: color-mix(in srgb, ${themeData.accent} 80%, white) !important;
        }
      `}</style>
      {children}
    </>
  );
}
