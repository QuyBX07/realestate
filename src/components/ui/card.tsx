import React from "react";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white border rounded-2xl shadow-lg ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className ?? ""}`}>{children}</div>;
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-b ${className ?? ""}`}>{children}</div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={`text-xl font-bold ${className ?? ""}`}>{children}</h2>;
}
