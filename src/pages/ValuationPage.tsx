import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { valuationPayloadService } from "../services/ValuationService";
import { PropertyPayload } from "../types/PropertyPayload";
import Swal from "sweetalert2";

const ValuationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    city: "",
    district: "",
    ward: "",
    street: "",
    area: "",
    type: "",
    bedroom: "",
    bathroom: "",
    legal: "",
  });

  const [loading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate: nếu có trường nào trống
    const requiredFields = [
      "city",
      "district",
      "ward",
      "street",
      "area",
      "type",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (emptyFields.length > 0) {
      Swal.fire({
        title: "⚠️ Thiếu thông tin",
        text: "Vui lòng điền đầy đủ các trường bắt buộc trước khi định giá.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
      });
      return; // 🚫 Dừng, không gọi API
    }

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

      const payload: PropertyPayload = {
        city: formData.city || "unknown",
        district: formData.district || "unknown",
        ward: formData.ward || "unknown",
        street: formData.street || "unknown",
        area: parseFloat(formData.area) || 0,
        type: formData.type || "unknown",
        bedroom: parseInt(formData.bedroom) || 0,
        bathroom: parseInt(formData.bathroom) || 0,
        legal: formData.legal || "unknown",
      };

      // Gọi API
      const res = await valuationPayloadService.predict(payload);

      setTimeout(() => {
        Swal.fire({
          title: "💰 Kết quả định giá",
          html: `<p class="text-green-600 text-2xl font-bold">${res.predicted_price.toLocaleString(
            "vi-VN"
          )} VND</p>`,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#16a34a",
        });
      }, 2500);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "❌ Lỗi định giá",
        text: "Không thể định giá, vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const fields = [
    { name: "city", placeholder: "Thành phố" },
    { name: "district", placeholder: "Quận/Huyện" },
    { name: "ward", placeholder: "Phường/Xã" },
    { name: "street", placeholder: "Đường" },
    { name: "area", placeholder: "Diện tích (m²)", type: "number" },
    { name: "type", placeholder: "Loại hình (VD: Chung cư, Nhà phố...)" },
    { name: "bedroom", placeholder: "Số phòng ngủ", type: "number" },
    { name: "bathroom", placeholder: "Số phòng tắm", type: "number" },
    { name: "legal", placeholder: "Pháp lý (VD: Sổ đỏ)" },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="w-10 h-10 mr-2 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">
            Định Giá Bất Động Sản
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Điền thông tin chi tiết để AI ước tính giá trị bất động sản của bạn
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl p-8 mx-auto bg-white border shadow-sm rounded-xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {fields.map((field) => (
            <div key={field.name}>
              <input
                name={field.name}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex justify-center col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang định giá..." : "Định giá ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ValuationPage;
