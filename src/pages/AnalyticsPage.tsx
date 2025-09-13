import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { PriceTrend } from "../types/PriceTrend";
import { priceTrendService } from "../services/PriceTrendService";

import { PropertyType } from "../types/PropertyType";
import { propertyTypeService } from "../services/PropertyTypeService";

import { Seller } from "../types/Seller";
import { sellerService } from "../services/SellerService";

import { WebsiteStat } from "../types/WebsiteStat";
import { websiteStatService } from "../services/WebsiteStatService";

type TimeRange = "7 ngày qua" | "30 ngày qua" | "90 ngày qua";

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("30 ngày qua");
  const [priceTrend, setPriceTrend] = useState<PriceTrend[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [websites, setWebsites] = useState<WebsiteStat[]>([]);

  // Fetch dữ liệu
  useEffect(() => {
    priceTrendService.getAll().then(setPriceTrend).catch(console.error);
    propertyTypeService.getAll().then(setPropertyTypes).catch(console.error);
    sellerService.getAll().then(setSellers).catch(console.error);
    websiteStatService.getAll().then(setWebsites).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Phân tích dữ liệu chi tiết
        </h1>
        <p className="text-gray-600">
          Thống kê và xu hướng thị trường bất động sản
        </p>
      </div>

      {/* Bộ lọc thời gian + nút xuất báo cáo */}
      <div className="flex items-center justify-between mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="px-3 py-2 border rounded"
        >
          <option value="7 ngày qua">7 ngày qua</option>
          <option value="30 ngày qua">30 ngày qua</option>
          <option value="90 ngày qua">90 ngày qua</option>
        </select>
        <Button>Xuất báo cáo</Button>
      </div>

      {/* Hàng 1: Xu hướng giá + Phân bố loại BĐS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Xu hướng giá */}
        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold">Xu hướng giá theo tháng</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={priceTrend}>
                <XAxis dataKey="month" />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Số tin",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Giá (tỷ VNĐ)",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip />
                <Bar yAxisId="left" dataKey="count" fill="#a855f7" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={(d: PriceTrend) => d.avg_price / 1_000_000_000}
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Phân bố loại BĐS */}
        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold">Phân bố loại BĐS</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypes}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {propertyTypes.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#3b82f6",
                          "#22c55e",
                          "#eab308",
                          "#a855f7",
                          "#f97316",
                          "#6b7280",
                        ][index % 6]
                      }
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hàng 2: Top người bán + Thống kê website */}
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
        {/* Top người bán */}
        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold">Top người bán</h2>
            <ul className="space-y-4">
              {sellers.map((s, index) => (
                <li key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {index + 1}. {s.name}
                    </div>
                    <div className="text-sm text-gray-500">📞 {s.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{s.posts} tin</div>
                    <div className="text-sm text-gray-500">
                      {(s.total_value / 1_000_000_000).toFixed(1)} tỷ
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Thống kê website */}
        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold">Thống kê theo website</h2>
            <ul className="space-y-4">
              {websites.map((w) => (
                <li key={w.id}>
                  <div className="flex justify-between">
                    <span>{w.name}</span>
                    <span className="font-medium">
                      {w.count}{" "}
                      <span className="text-green-600">+{w.growth}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 mt-1 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${w.percent}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {w.percent}% tổng tin đăng
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
