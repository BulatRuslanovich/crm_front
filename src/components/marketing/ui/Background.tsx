"use client";

export default function Background() {
  // const isDark = true;
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244, 114, 182, 0.25), transparent 70%), #000000",
      }}
    />
  )
}
