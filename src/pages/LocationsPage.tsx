import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  Users,
  MapPin,
  PieChart,
} from "lucide-react";
import { CityType } from "../types/CityType";
import { PriceAllocation } from "../types/PriceAllocation";
import { CityTypeService } from "../services/CityTypeService";
import { PriceAllocationService } from "../services/PriceAllocationService";

function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Tất cả thành phố");
  const [sortBy, setSortBy] = useState("Sắp xếp theo tin đăng");

  const [cities, setCities] = useState<CityType[]>([]);
  const [priceAllocations, setPriceAllocations] = useState<PriceAllocation[]>([]);

  useEffect(() => {
    CityTypeService.getAll().then(setCities).catch(console.error);
    PriceAllocationService.getAll().then(setPriceAllocations).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Phân tích theo địa điểm
          </h1>
          <p className="text-gray-600">
            Thống kê thị trường BĐS theo thành phố và quận/huyện
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm địa điểm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="lg:w-48">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option>Tất cả thành phố</option>
                {cities.map((c, i) => (
                  <option key={i}>{c.city}</option>
                ))}
              </select>
            </div>

            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option>Sắp xếp theo tin đăng</option>
                <option>Sắp xếp theo giá</option>
              </select>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* City Statistics */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cities
                .filter((c) =>
                  c.city.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((city, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {city.city}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Tin đăng</div>
                          <div className="font-semibold text-gray-900">
                            {city.postcount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Giá TB</div>
                          <div className="font-semibold text-gray-900">
                            
                            {(city.averagePrice / 1_000_000_000).toFixed(1)} tỷ
                            
                          </div>
                          
                        </div>
                      </div>
                      

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Loại phổ biến</div>
                          <div className="font-semibold text-gray-900">
                            {city.popularType}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Price Distribution */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Phân bố giá
                </h3>
              </div>

              <div className="space-y-4">
                {priceAllocations.map((range, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Dưới {range.price / 1_000_000_000} tỷ
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {range.percent}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
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
