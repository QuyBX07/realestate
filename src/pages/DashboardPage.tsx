import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Building,
  Phone,
  Eye,
  Search,
  Download,
} from "lucide-react";
import { Property } from "../types/Property";
import { propertyService } from "../services/PropertyService";

const DashboardPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await propertyService.getAll();
        setProperties(data);
      } catch (err) {
        // 👈 đổi từ error -> err và ép kiểu any
        setError("Không thể tải dữ liệu");
        console.error(err); // log ra để debug
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = properties.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = filterCity === "all" || item.city === filterCity;

    const matchesType =
      filterType === "all" ||
      item.title.toLowerCase().includes(filterType.toLowerCase());

    let matchesPrice = true;
    if (filterPrice !== "all") {
      const priceInMillions = item.price / 1_000_000; // convert sang triệu
      switch (filterPrice) {
        case "0-500":
          matchesPrice = priceInMillions < 500;
          break;
        case "500-1000":
          matchesPrice = priceInMillions >= 500 && priceInMillions < 1000;
          break;
        case "1000-2000":
          matchesPrice = priceInMillions >= 1000 && priceInMillions < 2000;
          break;
        case "2000-3000":
          matchesPrice = priceInMillions >= 2000 && priceInMillions < 3000;
          break;
        case "3000-5000":
          matchesPrice = priceInMillions >= 3000 && priceInMillions < 5000;
          break;
        case "5000-10000":
          matchesPrice = priceInMillions >= 5000 && priceInMillions < 10000;
          break;
        case "10000-20000":
          matchesPrice = priceInMillions >= 10000 && priceInMillions < 20000;
          break;
        case "20000+":
          matchesPrice = priceInMillions >= 20000;
          break;
      }
    }

    let matchesArea = true;
    if (filterArea !== "all") {
      switch (filterArea) {
        case "0-30":
          matchesArea = item.area < 30;
          break;
        case "30-50":
          matchesArea = item.area >= 30 && item.area < 50;
          break;
        case "50-80":
          matchesArea = item.area >= 50 && item.area < 80;
          break;
        case "80-120":
          matchesArea = item.area >= 80 && item.area < 120;
          break;
        case "120-200":
          matchesArea = item.area >= 120 && item.area < 200;
          break;
        case "200+":
          matchesArea = item.area >= 200;
          break;
      }
    }

    return (
      matchesSearch && matchesCity && matchesType && matchesPrice && matchesArea
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getPropertyType = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("căn hộ")) return "Căn hộ";
    if (lowerTitle.includes("nhà phố")) return "Nhà phố";
    if (lowerTitle.includes("đất nền")) return "Đất nền";
    if (lowerTitle.includes("biệt thự")) return "Biệt thự";
    if (lowerTitle.includes("chung cư")) return "Chung cư";
    if (lowerTitle.includes("shophouse")) return "Shophouse";
    return "Khác";
  };

  const stats = [
    {
      label: "Tổng tin đăng",
      value: properties.length.toLocaleString(),
      icon: Building,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      label: "Tin đang bán",
      value: properties.length.toLocaleString(),
      icon: TrendingUp,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      label: "Tổng lượt xem",
      value: "0",
      icon: Eye,
      color: "bg-purple-500",
      change: "+25%",
    },
    {
      label: "Người bán",
      value: new Set(
        properties.map((item) => item.seller)
      ).size.toLocaleString(),
      icon: Users,
      color: "bg-orange-500",
      change: "+5%",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Dashboard Phân Tích BDS
        </h1>
        <p className="text-gray-600">
          Theo dõi và phân tích dữ liệu bất động sản từ các website
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterCity}
            onChange={(e) => {
              const val = e.target.value;
              // chuẩn hoá value ngay tại đây
              if (val === "TP. Hồ Chí Minh" || val === "TP.HCM") {
                setFilterCity("TP.HCM"); // chuẩn hoá về 1 kiểu duy nhất
              } else {
                setFilterCity(val);
              }
              setCurrentPage(1); // reset về trang 1
            }}
          >
            <option value="all">Tất cả thành phố</option>
            <option value="TP.HCM">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Bình Dương">Bình Dương</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1); // reset về trang 1
            }}
          >
            <option value="all">Tất cả loại BDS</option>
            <option value="Căn hộ">Căn hộ</option>
            <option value="Nhà phố">Nhà phố</option>
            <option value="Đất nền">Đất nền</option>
            <option value="Biệt thự">Biệt thự</option>
            <option value="Chung cư">Chung cư</option>
            <option value="Shophouse">Shophouse</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterPrice}
            onChange={(e) => {
              setFilterPrice(e.target.value);
              setCurrentPage(1); // reset về trang 1
            }}
          >
            <option value="all">Tất cả giá</option>
            <option value="0-500">Dưới 500 triệu</option>
            <option value="500-1000">500 triệu - 1 tỷ</option>
            <option value="1000-2000">1 tỷ - 2 tỷ</option>
            <option value="2000-3000">2 tỷ - 3 tỷ</option>
            <option value="3000-5000">3 tỷ - 5 tỷ</option>
            <option value="5000-10000">5 tỷ - 10 tỷ</option>
            <option value="10000-20000">10 tỷ - 20 tỷ</option>
            <option value="20000+">Trên 20 tỷ</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterArea}
            onChange={(e) => {
              setFilterArea(e.target.value);
              setCurrentPage(1); // reset về trang 1
            }}
          >
            <option value="all">Tất cả diện tích</option>
            <option value="0-30">Dưới 30 m²</option>
            <option value="30-50">30 - 50 m²</option>
            <option value="50-80">50 - 80 m²</option>
            <option value="80-120">80 - 120 m²</option>
            <option value="120-200">120 - 200 m²</option>
            <option value="200+">Trên 200 m²</option>
          </select>

          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, địa chỉ, người bán..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="flex items-center justify-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Thông tin BDS
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Địa chỉ
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Người bán
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Giá / Diện tích
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Nguồn
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="mb-1 text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getPropertyType(item.title)}
                      </div>
                      <div className="flex items-center mt-1">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.address}</div>
                    <div className="text-sm text-gray-500">{item.city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.seller}
                    </div>
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {item.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price)}
                    </div>
                    <div className="text-sm text-gray-500">{item.area} m²</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {new URL(item.link).hostname}
                      </a>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(item.date_post)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Hiển thị {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredData.length)} trong
            tổng số {filteredData.length} kết quả
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
