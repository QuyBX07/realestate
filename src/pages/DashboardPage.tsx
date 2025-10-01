import React, { useState, useEffect } from "react";
import {
  Phone,
  Shield,
  Search,
  Download,
  Brain,
  Bed,
  Bath,
} from "lucide-react";
import { Property } from "../types/Property";
import { PropertyOptions } from "../types/PropertyOptions";
import { propertyService } from "../services/PropertyService";
import { valuationService } from "../services/ValuationService";
import { formatDateTime } from "../utils/dateUtils";
import { formatLegal } from "../utils/dateUtils";
import Swal from "sweetalert2";

const DashboardPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [options, setOptions] = useState<PropertyOptions>({
    cities: [],
    types: [],
  });

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
        const [props, opts] = await Promise.all([
          propertyService.getAll(),
          propertyService.getOptions(),
        ]);
        setProperties(props);
        setOptions(opts);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleValuation = async (property: Property) => {
    try {
      // Hiện popup loading
      Swal.fire({
        title: "🤖 Đang phân tích...",
        text: "Vui lòng chờ trong giây lát",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Gọi API song song
      const res = await valuationService.predict(property);

      setTimeout(() => {
        Swal.fire({
          title: "💰 Giá ước tính",
          text: `${formatPrice(res.predicted_price)}`,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#16a34a",
        });
      }, 2500);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "❌ Lỗi",
        text: "Không thể định giá",
        icon: "error",
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const safeIncludes = (
    field: string | number | null | undefined,
    keyword: string
  ) => (field ?? "").toString().toLowerCase().includes(keyword.toLowerCase());

  const filteredData = properties.filter((item) => {
    const matchesSearch =
      safeIncludes(item.title, searchTerm) ||
      safeIncludes(item.address, searchTerm) ||
      safeIncludes(item.seller, searchTerm) ||
      safeIncludes(item.city, searchTerm) ||
      safeIncludes(item.type, searchTerm) ||
      safeIncludes(item.numberPhone, searchTerm) ||
      safeIncludes(item.price, searchTerm) ||
      safeIncludes(item.link, searchTerm);

    const normalizeCity = (city: string) => {
      if (!city) return "";
      const c = city.toLowerCase().replace(/\s|\./g, "");
      if (c.includes("hochiminh") || c.includes("hcm"))
        return "TP. Hồ Chí Minh";
      return city.trim();
    };

    const matchesCity =
      filterCity === "all" || normalizeCity(item.city) === filterCity;

    const matchesType = filterType === "all" || item.type === filterType;

    let matchesPrice = true;
    if (filterPrice !== "all") {
      const priceInMillions = item.price / 1_000_000;
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

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "Giá thỏa thuận"; // null, undefined, 0 đều trả về
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // const formatDate = (dateString: string) =>
  //   new Date(dateString).toLocaleDateString("vi-VN");

  const renderPagination = () => {
    const pageButtons = [];
    const maxPagesToShow = 6;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Nếu còn trang trước
    if (startPage > 1) {
      pageButtons.push(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      pageButtons.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 border rounded-md text-sm ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      );
    }

    // Nếu còn trang sau
    if (endPage < totalPages) {
      pageButtons.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    return pageButtons;
  };

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

      {/* Filters and Search */}
      <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* City filter */}
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterCity}
            onChange={(e) => {
              setFilterCity(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả thành phố</option>
            {options.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả loại BDS</option>
            {options.types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Price filter */}
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterPrice}
            onChange={(e) => {
              setFilterPrice(e.target.value);
              setCurrentPage(1);
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

          {/* Area filter */}
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterArea}
            onChange={(e) => {
              setFilterArea(e.target.value);
              setCurrentPage(1);
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

          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, địa chỉ, người bán..."
              className="w-full py-2 pl-10 pr-4 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Export button */}
          <button className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
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
                <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">
                  Thông tin BDS
                </th>
                <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">
                  Địa chỉ
                </th>
                <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">
                  Người bán
                </th>
                <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">
                  Giá / Diện tích
                </th>
                <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">
                  Nguồn
                </th>
                <th className="px-6 py-4 text-xs font-medium text-center text-gray-500 uppercase">
                  Định giá
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="mb-1 text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">{item.type}</div>
                      <div className="flex items-center mt-1">
                        <Shield className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {formatLegal(item.legal)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Bed className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {item.bedroom}
                        </span>
                        {"     "}
                        <Bath className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {item.bathroom}
                        </span>
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
                        {item.numberPhone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.area} m² |{" "}
                      {item.unit_price
                        ? `${formatPrice(item.unit_price)}/m²`
                        : null}
                    </div>
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
                      {formatDateTime(item.postedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleValuation(item)}
                      className="flex items-center justify-center px-3 py-1 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <Brain className="w-4 h-4 mr-1" />
                      AI
                    </button>
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
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              Trước
            </button>

            {renderPagination()}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
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
