import React, { useState, useEffect } from "react";
import { RefreshCw, Eye } from "lucide-react";

interface Website {
  _id: string;
  name: string;
  enabled: boolean;
  updated_at: string;
  selected?: boolean;
}

// ... phần import và interface Website giữ nguyên

const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState({
    interval: 12, // mặc định 12h
  });

  const [websites, setWebsites] = useState<Website[]>([]);

  // Fetch websites from API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/websites")
      .then((res) => res.json())
      .then((data) => {
        // Add selected property for checkbox
        setWebsites(data.map((w: Website) => ({ ...w, selected: w.enabled ? true : false })));
      })
      .catch(() => {
        // fallback: keep empty or show error
      });
  }, []);


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
    // Lấy danh sách website đang enable nhưng bị bỏ tích
    const toDisable = websites.filter(w => w.enabled && !w.selected).map(w => w.name);
    // Lấy danh sách website đang disable nhưng được tích lại
    const toEnable = websites.filter(w => !w.enabled && w.selected).map(w => w.name);

    const requests = [];
    if (toDisable.length > 0) {
      requests.push(
        fetch("http://127.0.0.1:8000/websites/disable", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ names: toDisable })
        })
      );
    }
    if (toEnable.length > 0) {
      requests.push(
        fetch("http://127.0.0.1:8000/websites/enable", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ names: toEnable })
        })
      );
    }
    if (requests.length > 0) {
      Promise.all(requests)
        .then(responses => {
          if (responses.some(res => !res.ok)) throw new Error();
          alert("✅ Đã lưu cài đặt thành công.");
        })
        .catch(() => {
          alert("⚠️ Không thể cập nhật trạng thái website.");
        });
    } else {
      alert("✅ Đã lưu cài đặt thành công.");
    }
    // TODO: gọi API lưu config nếu cần
  };


  // State để điều khiển nút cào/dừng
  const [isCrawling, setIsCrawling] = useState(false);

  // Hàm bắt đầu cào
  const handleStartCrawling = () => {
    const selectedSites = websites.filter((w) => w.selected);
    if (selectedSites.length === 0) {
      alert("⚠️ Chưa chọn website nào để cào.");
      return;
    }

    const names = selectedSites.map(w => w.name);
    // Gửi danh sách websites qua query string
    const params = names.map(n => `websites=${encodeURIComponent(n)}`).join('&');
    setIsCrawling(true);
    fetch(`http://127.0.0.1:8000/crawl_now?${params}`, {
      method: "POST"
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        alert(`🚀 ${data.message}`);
      })
      .catch(() => {
        alert("⚠️ Không thể bắt đầu cào.");
        setIsCrawling(false);
      });
  };

  // Hàm dừng cào
  const handleStopCrawling = () => {
    fetch("http://localhost:8000/stop_now", { method: "POST" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        alert("🛑 Đã gửi yêu cầu dừng cào.");
        setIsCrawling(false);
      })
      .catch(() => {
        alert("⚠️ Không thể dừng cào.");
      });
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
                onChange={(e) => {
                  const hours = Number(e.target.value);
                  setConfig({ ...config, interval: hours });
                  // Gọi API schedule_crawl khi thay đổi interval
                  fetch(`http://127.0.0.1:8000/schedule_crawl?hours=${hours}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    }
                  })
                    .then((res) => {
                      if (!res.ok) throw new Error("Lỗi khi cập nhật lịch cào");
                      return res.json();
                    })
                    .catch(() => {
                      alert("⚠️ Không thể cập nhật lịch cào.");
                    });
                }}
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
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Website</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Cập nhật</th>
                  <th className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase">Hành động</th>
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
                  <tr key={site._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{site.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {site.enabled ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">Hoạt động</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">Tạm dừng</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{new Date(site.updated_at).toLocaleString()}</td>
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
          {isCrawling ? (
            <button
              className="px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
              onClick={handleStopCrawling}
            >
              🛑 Dừng ngay
            </button>
          ) : (
            <button
              className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
              onClick={handleStartCrawling}
            >
              � Bắt đầu cào
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
