import React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-2xl"
        onClick={(e) => e.stopPropagation()} // tránh click nền đóng dialog
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute text-gray-500 top-3 right-3 hover:text-gray-800"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

// ---- Subcomponents ----

export const DialogHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={`mb-4 ${className ?? ""}`}>{children}</div>;
};

export const DialogTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h3 className={`text-lg font-semibold ${className ?? ""}`}>{children}</h3>
  );
};

export const DialogContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={`${className ?? ""}`}>{children}</div>;
};
