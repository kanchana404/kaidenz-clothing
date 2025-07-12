"use client";
import React from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      aria-label="Toggle Theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        borderRadius: 8,
        padding: "0.5rem 1rem",
        border: "none",
        cursor: "pointer",
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 600,
        fontSize: 16,
      }}
    >
      {theme === "dark" ? (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
          Light
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
          Dark
        </>
      )}
    </button>
  );
} 