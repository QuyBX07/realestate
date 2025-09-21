import React from "react";
import {
  Home,
  BarChart3,
  Map,
  Building,
  Calendar,
  // Search,
  Filter,
  Activity,
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "analytics", label: "Phân tích", icon: BarChart3 },
    { id: "locations", label: "Địa điểm", icon: Map },
    { id: "properties", label: "Loại BDS", icon: Building },
    { id: "timeline", label: "Thời gian", icon: Calendar },
    // { id: "search", label: "Tìm kiếm", icon: Search },
    { id: "filter", label: "Bộ lọc", icon: Filter },
    { id: "valuation", label: "Định giá AI", icon: Activity },
  ];

  return (
    <div className="w-64 min-h-screen p-4 text-white bg-gray-900">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-blue-400">
          RealEstate Admin
        </h1>
        <p className="text-sm text-gray-400">Phân tích dữ liệu BDS</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeItem === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
