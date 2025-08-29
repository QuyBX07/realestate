import React from "react";
import Sidebar from "../components/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  activeItem: string;
  onItemClick: (item: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeItem, onItemClick }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} onItemClick={onItemClick} />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
