import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";
import { propertyFilterService } from "../services/PropertyFilterService";
import { Property } from "../types/Property";
import { formatDateTime } from "../utils/dateUtils";
import { propertyService } from "../services/PropertyService";
import { PropertyOptions } from "../types/PropertyOptions";

const PRICE_MAX = 20_000_000_000;
const AREA_MAX = 1000;
const ITEMS_PER_PAGE = 12;

const FilterPage: React.FC = () => {
  const [options, setOptions] = useState<PropertyOptions>({
    cities: [],
    types: [],
  });

  const [types, setTypes] = useState<string[]>([]);
  const [city, setCity] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([
    1_000_000_000, 5_000_000_000,
  ]);
  const [areaRange, setAreaRange] = useState<number[]>([30, 200]);

  const [allResults, setAllResults] = useState<Property[]>([]);
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sort, setSort] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleTypeChange = (type: string, checked: boolean) => {
    setTypes((prev) =>
      checked ? [...prev, type] : prev.filter((t) => t !== type)
    );
  };

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyFilterService.filter({
        types,
        city,
        minPrice: priceRange[0],
        maxPrice: priceRange[1] === PRICE_MAX ? undefined : priceRange[1],
        minArea: areaRange[0],
        maxArea: areaRange[1] === AREA_MAX ? undefined : areaRange[1],
      });
      setAllResults(data);
      setCurrentPage(1); // reset về trang 1
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const opts = await propertyService.getOptions();
        setOptions(opts);
      } catch (err) {
        console.error("Lỗi load options", err);
      }
    };
    fetchOptions();
  }, []);

  // Sắp xếp frontend
  useEffect(() => {
    const sorted = [...allResults];
    switch (sort) {
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "areaAsc":
        sorted.sort((a, b) => a.area - b.area);
        break;
      case "areaDesc":
        sorted.sort((a, b) => b.area - a.area);
        break;
      case "dateAsc":
        sorted.sort(
          (a, b) =>
            new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
        );
        break;
      case "dateDesc":
        sorted.sort(
          (a, b) =>
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
        break;
    }
    setResults(sorted);
    setCurrentPage(1);
  }, [sort, allResults]);

  // Slice dữ liệu để hiển thị trang hiện tại
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

  const renderPagination = () => {
    const pageButtons = [];
    const maxPagesToShow = 6;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1)
      pageButtons.push(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );

    for (let page = startPage; page <= endPage; page++) {
      pageButtons.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? "bg-blue-600 text-white" : ""
          }`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages)
      pageButtons.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );

    return pageButtons;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Filter */}
      <aside className="p-6 space-y-6 bg-white shadow-lg w-72">
        <h2 className="text-xl font-bold">Bộ lọc</h2>
        {/* Loại hình */}
        <div>
          <h3 className="mb-2 font-semibold text-gray-700">Loại hình</h3>
          {options.types.map((t) => (
            <label key={t} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={types.includes(t)}
                onChange={(e) => handleTypeChange(t, e.target.checked)}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>

        {/* Thành phố */}
        <div>
          <h3 className="mb-2 font-semibold text-gray-700">Thành phố</h3>
          <select
            className="w-full p-2 border rounded-lg"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Tất cả</option>
            {options.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Khoảng giá */}
        <div>
          <h3 className="mb-2 font-semibold text-gray-700">Khoảng giá (tỷ)</h3>
          <Slider
            value={priceRange}
            min={0}
            max={PRICE_MAX}
            step={500_000_000}
            onChange={(_, value) =>
              Array.isArray(value) && setPriceRange(value)
            }
          />
          <p>
            {priceRange[0] / 1_000_000_000} –{" "}
            {priceRange[1] === PRICE_MAX ? "∞" : priceRange[1] / 1_000_000_000}{" "}
            tỷ
          </p>
        </div>

        {/* Diện tích */}
        <div>
          <h3 className="mb-2 font-semibold text-gray-700">Diện tích (m²)</h3>
          <Slider
            value={areaRange}
            min={10}
            max={AREA_MAX}
            step={10}
            onChange={(_, value) => Array.isArray(value) && setAreaRange(value)}
          />
          <p>
            {areaRange[0]} – {areaRange[1] === AREA_MAX ? "∞" : areaRange[1]} m²
          </p>
        </div>

        <button
          className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={fetchResults}
        >
          Áp dụng
        </button>

        <button
          className="w-full py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => {
            setTypes([]);
            setCity("");
            setPriceRange([1_000_000_000, 5_000_000_000]);
            setAreaRange([30, 200]);
            setSort("");
            setAllResults([]);
            setResults([]);
            setCurrentPage(1);
          }}
        >
          Xóa bộ lọc
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Kết quả tìm kiếm</h1>
          <select
            className="p-2 border rounded-lg"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Mặc định</option>
            <option value="priceAsc">Giá ↑</option>
            <option value="priceDesc">Giá ↓</option>
            <option value="areaAsc">Diện tích ↑</option>
            <option value="areaDesc">Diện tích ↓</option>
            <option value="dateDesc">Ngày đăng mới nhất</option>
            <option value="dateAsc">Ngày đăng cũ nhất</option>
          </select>
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedResults.map((item) => (
                <div
                  key={item.id}
                  className="p-4 transition bg-white shadow rounded-xl hover:shadow-lg"
                >
                  <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
                  <p className="text-gray-600">Khu vực: {item.city}</p>
                  <p className="font-bold text-blue-600">
                    {(item.price / 1_000_000_000).toFixed(1)} tỷ
                  </p>
                  <p className="text-gray-600">Diện tích: {item.area} m²</p>
                  <p className="text-gray-700">Người bán: {item.seller}</p>
                  <p className="text-gray-700">SĐT: {item.numberPhone}</p>
                  <p className="text-sm text-gray-400">
                    Ngày đăng:{" "}
                    {formatDateTime(item.postedDate) /* định dạng ngày */}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 underline hover:text-blue-800"
                  >
                    Xem chi tiết
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  {"<"}
                </button>

                {renderPagination()}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  {">"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FilterPage;
