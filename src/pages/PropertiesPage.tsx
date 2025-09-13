import React, { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { propertyTypeSummaryService } from "../services/PropertyTypeSummaryService";
import { propertyTypeTrendService } from "../services/PropertyTypeSummaryService";
import { PropertyTypeSummary } from "../types/PropertyTypeSummary";
import { PropertyTypeTrend } from "../types/PropertyTypeTrend";

const PropertySummaryPage: React.FC = () => {
  // --- State cho Summary ---
  const [summaryData, setSummaryData] = useState<PropertyTypeSummary[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);

  // --- State cho Trend ---
  const [trendData, setTrendData] = useState<PropertyTypeTrend[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [errorTrend, setErrorTrend] = useState<string | null>(null);

  useEffect(() => {
    // Fetch summary
    const fetchSummary = async () => {
      try {
        const res = await propertyTypeSummaryService.getSummaryByType();
        setSummaryData(res);
      } catch (err) {
        console.error(err);
        setErrorSummary("Không thể tải dữ liệu summary");
      } finally {
        setLoadingSummary(false);
      }
    };

    // Fetch trend
    const fetchTrend = async () => {
      try {
        const res = await propertyTypeTrendService.getTrendLast7Days();
        setTrendData(res);
      } catch (err) {
        console.error(err);
        setErrorTrend("Không thể tải dữ liệu trend");
      } finally {
        setLoadingTrend(false);
      }
    };

    fetchSummary();
    fetchTrend();
  }, []);

  const formatPrice = (price: number) => {
    return (price / 1_000_000_000).toFixed(1) + " tỷ";
  };

  if (loadingSummary || loadingTrend) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (errorSummary || errorTrend) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600">{errorSummary || errorTrend}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-12 bg-gray-50">
      {/* ===================== PHẦN 1: SUMMARY ===================== */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Thống kê BĐS theo loại hình
        </h1>
        <p className="mb-8 text-gray-600">
          Tổng quan thị phần, giá trung bình, diện tích và khu vực hot
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {summaryData.map((item, idx) => (
            <div
              key={idx}
              className="transition bg-white border shadow-sm rounded-2xl hover:shadow-lg"
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="text-blue-500" />
                    <h3 className="text-lg font-semibold">{item.type}</h3>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Tin đăng</p>
                    <p className="font-semibold">{item.totalListings}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Giá TB</p>
                    <p className="font-semibold">
                      {formatPrice(item.avgPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Diện tích TB</p>
                    <p className="font-semibold">
                      {item.avgArea.toFixed(0)} m²
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Thị phần</p>
                    <p className="font-semibold">
                      {item.marketShare.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Extra info */}
                <div className="pt-2 text-sm text-gray-700">
                  <p>
                    <span className="text-gray-500">Khu vực hot: </span>
                    <span className="font-medium text-blue-600">
                      {item.hotCity || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Khoảng giá: </span>
                    {formatPrice(item.minPrice)} - {formatPrice(item.maxPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== PHẦN 2: TREND ===================== */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Xu hướng BĐS 7 ngày gần đây
        </h2>
        <p className="mb-6 text-gray-600">
          Biến động theo ngày của từng loại hình bất động sản
        </p>

        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-700 bg-gray-100">
              <tr>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Loại hình</th>
                <th className="px-4 py-3">Số tin đăng</th>
                <th className="px-4 py-3">Giá TB</th>
                <th className="px-4 py-3">Diện tích TB</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.count}</td>
                  <td className="px-4 py-3">{formatPrice(item.avgPrice)}</td>
                  <td className="px-4 py-3">{item.avgArea.toFixed(0)} m²</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertySummaryPage;
