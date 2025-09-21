import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { valuationPayloadService } from "../services/ValuationService";
import { PropertyPayload } from "../types/PropertyPayload";
import Swal from "sweetalert2";

const ValuationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    city: "",
    district: "",
    area: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    facade: "",
    legalStatus: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: PropertyPayload = {
        city: formData.city,
        district: formData.district || undefined,
        area: parseFloat(formData.area),
        type: formData.type,
        bedroom: parseInt(formData.bedrooms) || 0,
        bathroom: parseInt(formData.bathrooms) || 0,
        facade: parseFloat(formData.facade) || 0,
        legalStatus: formData.legalStatus || "chưa rõ",
      };

      const res = await valuationPayloadService.predict(payload);

      Swal.fire({
        title: "💰 Kết quả định giá",
        html: `<p class="text-green-600 text-xl font-bold">${res.predicted_price.toLocaleString(
          "vi-VN"
        )} VND</p>`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#16a34a",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "❌ Lỗi định giá",
        text: "Không thể định giá, vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-2xl p-6 bg-white border shadow-lg rounded-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Calculator className="w-6 h-6 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Định giá BĐS</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
          {[
            { name: "city", placeholder: "Thành phố" },
            { name: "district", placeholder: "Quận/Huyện" },
            { name: "area", placeholder: "Diện tích (m²)", type: "number" },
            {
              name: "type",
              placeholder: "Loại hình (VD: Chung cư, Nhà phố...)",
            },
            { name: "bedrooms", placeholder: "Số phòng ngủ", type: "number" },
            { name: "bathrooms", placeholder: "Số phòng tắm", type: "number" },
            { name: "facade", placeholder: "Mặt tiền (m)", type: "number" },
            { name: "legalStatus", placeholder: "Pháp lý (VD: Sổ đỏ)" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <div className="flex justify-center col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang định giá..." : "Định giá"}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="text-sm text-gray-500">
          Điền đầy đủ thông tin để AI ước tính giá bất động sản chính xác nhất.
        </div>
      </div>
    </div>
  );
};

export default ValuationPage;
