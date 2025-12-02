import React from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  type = "button",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-primary text-primary bg-transparent hover:bg-primary/10",
  };
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

