import React, { useRef, useState } from "react";
import { debounce } from "lodash";

interface ProductTopBarProps {
  totalProducts: number;
  onSortChange: (value: string) => void;
  onSearch: (value: string) => void;
  searchValue: string;
}

const ProductTopBar: React.FC<ProductTopBarProps> = ({
  totalProducts,
  onSortChange,
  onSearch,
  searchValue,
}) => {
  // ایجاد state محلی برای نمایش فوری تغییرات
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // ایجاد تابع debounced برای جستجو
  const debouncedSearch = useRef(
    debounce((value: string) => {
      onSearch(value);
    }, 500)
  ).current;

  // تابع handleSearch برای مدیریت تغییرات input
  const handleSearch = (value: string) => {
    // به‌روزرسانی فوری مقدار نمایشی
    setLocalSearchValue(value);
    // ارسال درخواست با تاخیر
    debouncedSearch(value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="text-sm text-gray-500">
        تعداد محصولات: {totalProducts}
      </div>
      <div className="flex flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        {/* جستجو */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={localSearchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="جستجوی محصولات..."
            className="w-full px-4 py-2 pr-10 rounded-lg border-2 border-[#fff1cc] focus:border-[#7a4522] focus:outline-none transition-colors text-sm"
          />
          {localSearchValue && (
            <button
              onClick={() => handleSearch("")}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7a4522] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {/* مرتب‌سازی */}
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 rounded-lg border-2 border-[#fff1cc] focus:border-[#7a4522] focus:outline-none transition-colors text-sm bg-white"
        >
          <option value="newest">جدیدترین</option>
          <option value="cheapest">ارزان‌ترین</option>
          <option value="expensive">گران‌ترین</option>
        </select>
      </div>
    </div>
  );
};

export default ProductTopBar; 