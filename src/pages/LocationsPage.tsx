import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Building2,
  DollarSign,
  MapPin,
  PieChart,
} from "lucide-react";
import { CityType } from "../types/CityType";
import { PriceAllocation } from "../types/PriceAllocation";
import { CityTypeService } from "../services/CityTypeService";
import { PriceAllocationService } from "../services/PriceAllocationService";

function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<CityType[]>([]);
  const [priceAllocations, setPriceAllocations] = useState<PriceAllocation[]>(
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Load city data
  useEffect(() => {
    CityTypeService.getAll().then(setCities).catch(console.error);
  }, []);

  // Load price allocation từ backend (MongoDB aggregation)
  useEffect(() => {
    PriceAllocationService.getAll()
      .then(setPriceAllocations)
      .catch(console.error);
  }, []);

  // Filter & pagination
  const filteredCities = cities
    .filter((c) => c.city)
    .filter((c) => c.city.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredCities.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCities = filteredCities.slice(
    startIndex,
    startIndex + pageSize
  );

  // Gắn nhãn bucket hiển thị
  const priceLabels = [
    [2_000_000_000, "Dưới 2 tỷ"],
    [5_000_000_000, "2-5 tỷ"],
    [10_000_000_000, "5-10 tỷ"],
    [20_000_000_000, "10-20 tỷ"],
    [100_000_000_001, "Trên 20 tỷ"],
  ];

  const labeledPriceAllocations = priceAllocations.map((pa) => {
    const label =
      priceLabels.find((l) => l[0] === pa.price)?.[1] || pa.price.toString();
    return { ...pa, label };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Phân tích theo địa điểm
          </h1>
          <p className="text-gray-600">
            Thống kê thị trường BĐS theo thành phố và quận/huyện
          </p>
        </div>

        {/* Search + Export */}
        <div className="p-6 mb-8 bg-white border shadow-sm rounded-xl">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm địa điểm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* City Statistics */}
          <div className="lg:col-span-3">
            <div className="grid gap-6 justify-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
              {paginatedCities.map((city, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between p-5 transition-shadow duration-200 bg-white border shadow-sm rounded-xl hover:shadow-md"
                >
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    {city.city}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Tin đăng</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {city.postcount?.toLocaleString() ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Giá TB</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {(city.averagePrice / 1_000_000_000).toFixed(1)} tỷ
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Loại phổ biến
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {city.popularType || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Trang trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>

          {/* Price Distribution Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white border shadow-sm rounded-xl top-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Phân bố giá
                </h3>
              </div>

              <div className="space-y-4">
                {labeledPriceAllocations.map((range, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {range.label}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {range.percent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${range.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationsPage;
