import React, { useEffect, useState } from "react";
import { Property } from "../types/Property";
import { propertyService } from "../services/PropertyService";

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 👈 khai báo error có kiểu string hoặc null

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {   // 👈 đổi từ error -> err và ép kiểu any
      setError("Không thể tải dữ liệu"); 
      console.error(err);  // log ra để debug
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Properties</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Tiêu đề</th>
            <th className="px-4 py-2 border">Địa chỉ</th>
            <th className="px-4 py-2 border">Thành phố</th>
            <th className="px-4 py-2 border">Giá</th>
            <th className="px-4 py-2 border">Diện tích</th>
            <th className="px-4 py-2 border">Phòng ngủ</th>
            <th className="px-4 py-2 border">Phòng tắm</th>
            <th className="px-4 py-2 border">Người bán</th>
            <th className="px-4 py-2 border">Điện thoại</th>
            <th className="px-4 py-2 border">Link</th>
            <th className="px-4 py-2 border">Ngày đăng</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p._id}>
              <td className="px-4 py-2 border">{p.title}</td>
              <td className="px-4 py-2 border">{p.address}</td>
              <td className="px-4 py-2 border">{p.city}</td>
              <td className="px-4 py-2 border">{p.price.toLocaleString()} VND</td>
              <td className="px-4 py-2 border">{p.area}</td>
              <td className="px-4 py-2 border">{p.bedroom}</td>
              <td className="px-4 py-2 border">{p.bathroom}</td>
              <td className="px-4 py-2 border">{p.seller}</td>
              <td className="px-4 py-2 border">{p.phone}</td>
              <td className="px-4 py-2 border">
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  Xem
                </a>
              </td>
              <td className="px-4 py-2 border">{p.date_post}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesPage;
