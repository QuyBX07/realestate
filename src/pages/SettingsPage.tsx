import React, { useState } from "react";
import { RefreshCw, Eye } from "lucide-react";

interface Website {
  name: string;
  status: string;
  last: string;
  posts: number;
  success: string;
  selected?: boolean;
}

// ... phần import và interface Website giữ nguyên

const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState({
    interval: 12, // mặc định 12h
  });

  const [websites, setWebsites] = useState<Website[]>([
    {
      name: "Batdongsan.com.vn",
      status: "Hoạt động",
      last: "2024-09-20 14:30",
      posts: 520,
      success: "98.5%",
      selected: false,
    },
    {
      name: "Alonhadat.com.vn",
      status: "Hoạt động",
      last: "2024-09-20 14:25",
      posts: 380,
      success: "97.2%",
      selected: false,
    },
    {
      name: "Nhadat247.com.vn",
      status: "Tạm dừng",
      last: "2024-09-20 12:00",
      posts: 210,
      success: "95.8%",
      selected: false,
    },
    {
      name: "Cafeland.vn",
      status: "Lỗi",
      last: "2024-09-20 10:15",
      posts: 95,
      success: "89.3%",
      selected: false,
    },
  ]);

  const toggleSelect = (index: number, checked: boolean) => {
    setWebsites((prev) =>
      prev.map((w, i) => (i === index ? { ...w, selected: checked } : w))
    );
  };

  const allSelected = websites.length > 0 && websites.every((w) => w.selected);
  const toggleSelectAll = (checked: boolean) =>
    setWebsites((prev) => prev.map((w) => ({ ...w, selected: checked })));

  // Hàm lưu cài đặt
  const handleSave = () => {
    console.log("Cấu hình lưu:", config);
    alert("✅ Đã lưu cài đặt thành công.");
    // TODO: gọi API lưu config + websites
  };

  // Hàm bắt đầu cào
  const handleStartCrawling = () => {
    const selectedSites = websites.filter((w) => w.selected);
    if (selectedSites.length === 0) {
      alert("⚠️ Chưa chọn website nào để cào.");
      return;
    }

    console.log("Bắt đầu cào các website:", selectedSites);
    alert(`🚀 Bắt đầu cào ${selectedSites.length} website.`);
    // TODO: gọi API hoặc trigger quá trình cào
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Cài đặt hệ thống
        </h1>
        <p className="text-gray-600">Quản lý cấu hình và trạng thái websites</p>
      </div>

      {/* Config + Websites */}
      <div className="space-y-6">
        {/* Config Form */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">Cấu hình thu thập</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm text-gray-600">
                Khoảng thời gian
              </label>
              <select
                value={config.interval}
                onChange={(e) =>
                  setConfig({ ...config, interval: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={12}>12 giờ</option>
                <option value={24}>24 giờ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Websites Status */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">Danh sách websites</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Website
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Lần cuối
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Tin đăng
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Thành công
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase">
                    Hành động
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase">
                    <label className="flex items-center justify-center gap-2">
                      Cào?
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-4 h-4"
                        title="Chọn tất cả"
                      />
                    </label>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {websites.map((site, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {site.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {site.last}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {site.posts}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {site.success}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-gray-600 rounded hover:bg-gray-100">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 rounded hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={!!site.selected}
                        onChange={(e) => toggleSelect(i, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2 Buttons riêng */}
        <div className="flex justify-end gap-4">
          <button
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={handleSave}
          >
            💾 Lưu cài đặt
          </button>
          <button
            className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={handleStartCrawling}
          >
            🚀 Bắt đầu cào
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
