import React, { useEffect, useState } from "react";
import { timelineService } from "../services/TimelineService";
import timelinePriceService from "../services/timelinePriceService";
import { Timeline } from "../types/Timeline";
import { TimelinePrice } from "../types/TimelinePrice";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

type Mode = "last7days" | "weeks" | "year";

const TimelinePage: React.FC = () => {
  const [data, setData] = useState<Timeline[]>([]);
  const [priceData, setPriceData] = useState<TimelinePrice[]>([]);
  const [mode, setMode] = useState<Mode>("last7days");
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(9);
  const [loading, setLoading] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      let result: Timeline[] = [];
      if (mode === "last7days") {
        result = await timelineService.getLast7Days();
      } else if (mode === "weeks") {
        result = await timelineService.getByWeeks(year, month);
      } else if (mode === "year") {
        result = await timelineService.getByYear(year);
      }
      setData(result);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceData = async () => {
    try {
      setLoadingPrice(true);
      let result: TimelinePrice[] = [];
      if (mode === "last7days") {
        result = await timelinePriceService.getLast7Days();
      } else if (mode === "weeks") {
        result = await timelinePriceService.getByWeeks(year, month);
      } else if (mode === "year") {
        result = await timelinePriceService.getByYear(year);
      }
      setPriceData(result);
    } catch (error) {
      console.error("Error fetching price timeline:", error);
    } finally {
      setLoadingPrice(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPriceData();
  }, [mode, year, month, fetchData, fetchPriceData]);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Timeline</h1>
        <p className="text-gray-600">
          Thống kê số lượng tin đăng và giá trung bình theo thời gian
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-2 border rounded"
        >
          <option value="last7days">7 ngày qua</option>
          <option value="weeks">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>

        {mode !== "last7days" && (
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-24 px-3 py-2 border rounded"
            placeholder="Năm"
          />
        )}

        {mode === "weeks" && (
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-20 px-3 py-2 border rounded"
            placeholder="Tháng"
            min={1}
            max={12}
          />
        )}

        <Button
          onClick={() => {
            fetchData();
            fetchPriceData();
          }}
        >
          Làm mới
        </Button>
      </div>

      {/* Chart 1: Số tin đăng */}
      <Card>
        <CardContent>
          <h2 className="mb-4 font-semibold">
            {mode === "last7days"
              ? "Số tin đăng trong 7 ngày qua"
              : mode === "weeks"
              ? `Số tin đăng theo tuần (${month}/${year})`
              : `Số tin đăng theo tháng (${year})`}
          </h2>

          {loading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500">Không có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="totalPosts"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Chart 2: Giá trung bình */}
      <Card>
        <CardContent>
          <h2 className="mb-4 font-semibold">
            {mode === "last7days"
              ? "Giá trung bình trong 7 ngày qua"
              : mode === "weeks"
              ? `Giá trung bình theo tuần (${month}/${year})`
              : `Giá trung bình theo tháng (${year})`}
          </h2>

          {loadingPrice ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : priceData.length === 0 ? (
            <p className="text-gray-500">Không có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => `${(v / 1e9).toFixed(1)} tỷ`} />
                <Tooltip
                  formatter={(value: number) =>
                    `${(value / 1e9).toFixed(2)} tỷ VNĐ`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="avgPrice"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelinePage;
