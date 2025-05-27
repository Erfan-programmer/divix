import { useEffect, useState } from "react";
import ProductTopBar from "../../Modules/Products/ProductTopBar";
import ProductCard from "../../Modules/Home/ProductCard";
import { FaFilter } from "react-icons/fa";
import Breadcrumb from "../../Modules/Breadcrumb";
import { Checkbox, Slider } from "@mui/material";

import { useNavigate, useSearchParams } from "react-router-dom";
import SEOFunction from "../../Modules/SeoFunction/SeoFunction";
export interface Product {
  id: number;
  title: string;
  title_en: string;
  type: string;
  price: number;
  regular_price: number;
  sale_price: number;
  slug: string;
  image: string | null;
  special: boolean;
  category: string;
  published_date: string;
  is_available: boolean;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  result: {
    data: Product[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: {
        url: string | null;
        label: string;
        active: boolean;
      }[];
      path: string;
      per_page: string;
      to: number;
      total: number;
    };
  };
}

interface SubCategory {
  id: number;
  image: string;
  title: string;
  slug: string;
  categories: any[];
  category_id: number;
  products_count: number;
}

interface Category {
  id: number;
  image: string;
  title: string;
  slug: string;
  categories: SubCategory[];
  category_id: number | null;
  products_count: number;
}

interface Filter {
  attributes: any[];
  price_range: {
    min: number;
    max: number;
  };
  brands: {
    id: number;
    name: string;
    count: number;
  }[];
}

const ProductsPage = () => {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [fromItem, setFromItem] = useState<number>(0);
  const [toItem, setToItem] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paginationLinks, setPaginationLinks] = useState<
    {
      url: string | null;
      label: string;
      active: boolean;
    }[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filter>({
    attributes: [],
    price_range: { min: 0, max: 0 },
    brands: [],
  });
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams[0]);
    params.set("sort", value);
    navigate(`/products?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");

    if (!categoryFromUrl) {
      return;
    }
  }, [products, location.search, categories]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://admin.mydivix.com/api/v1/categories",
          {
            signal: abortController.signal
          }
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.result.data)) {
          setCategories(data.result.data);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('درخواست دسته‌بندی‌ها لغو شد');
          return;
        }
        console.error("خطا در دریافت دسته‌بندی‌ها:", err);
      }
    };
    fetchCategories();

    return () => {
      abortController.abort();
    };
  }, []);

  const handlePageChange = (url: string | null) => {
    if (!url) return;

    try {
      const newUrl = new URL(url);
      navigate(`?${newUrl.search.slice(1)}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("خطا در تغییر صفحه:", err);
    }
  };

  // محاسبه تعداد صفحات

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    navigate(`?${params.toString()}`);
  };

  const handleSearchFunction = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams[0]);
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    navigate(`/products?${params.toString()}`);
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();

        const searchFromUrl = searchParams[0].get("search");
        const sortFromUrl = searchParams[0].get("sort");
        const categoryId = searchParams[0].get("category_id");
        const page = searchParams[0].get("page");

        if (searchFromUrl) {
          params.set("search", searchFromUrl);
        }
        if (sortFromUrl) {
          params.set("sort", sortFromUrl);
        }
        if (categoryId) {
          params.set("category_id", categoryId);
        }
        if (page) {
          params.set("page", page);
        }

        params.set("per_page", "20");

        const response = await fetch(
          `https://admin.mydivix.com/api/v1/products?${params}`,
          {
            signal: abortController.signal
          }
        );
        const data: ProductsResponse = await response.json();

        if (data.success) {
          setProducts(data.result.data);
          setPaginationLinks(data.result.meta.links);
          setTotalItems(data.result.meta.total);
          setFromItem(data.result.meta.from);
          setToItem(data.result.meta.to);
          setSearchQuery(searchFromUrl || "");
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('درخواست محصولات لغو شد');
          return;
        }
        console.error("خطا در دریافت محصولات:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      abortController.abort();
    };
  }, [searchParams[0]]);

  const breadcrumbItems = [{ title: "محصولات" }];

  const toggleCategory = (categoryId: number) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    params.set("category_id", categoryId);
    navigate(`/products?${params.toString()}`);
  };

  const fetchCategoryFilters = async (categoryId: string) => {
    if (!categoryId) {
      setFilters({
        attributes: [],
        price_range: { min: 0, max: 0 },
        brands: [],
      });
      return;
    }

    const abortController = new AbortController();
    setIsLoadingFilters(true);

    try {
      const response = await fetch(
        `https://admin.mydivix.com/api/v1/categories/${categoryId}/filter`,
        {
          signal: abortController.signal
        }
      );
      const data = await response.json();

      if (data.success) {
        setFilters(data);
      } else {
        console.error("خطا در دریافت فیلترها:", data.message);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('درخواست فیلترها لغو شد');
        return;
      }
      console.error("خطا در دریافت فیلترها:", err);
    } finally {
      setIsLoadingFilters(false);
    }

    return () => {
      abortController.abort();
    };
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryFilters(selectedCategory);
    }
  }, [selectedCategory]);

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleBrandChange = (brandId: number) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  return (
    <>
      <SEOFunction
        title={"فروشگاه چرم دیویکس"}
        description={
          "با جدیدترین محصولات چرمی فروشگاه دیویکس آشنا شوید. انواع کیف، کفش و اکسسوری‌های چرمی دست‌دوز با کیفیت بالا و طراحی خاص برای سلیقه‌های متفاوت."
        }
        type="blogs"
        url={`https://mydivix.com/products`}
        image={"/images/divix-logo-final.png"}
        website_name="فروشگاه دیویکس"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div
            className={`fixed xl:static top-0 right-0 h-full w-80 bg-white xl:bg-transparent z-50 xl:z-auto transform transition-transform duration-300 ease-in-out ${
              isFilterOpen
                ? "translate-x-0"
                : "translate-x-full xl:translate-x-0"
            } xl:col-span-1 space-y-8 p-4 xl:p-0 overflow-y-auto`}
          >
            {/* دکمه بستن برای موبایل */}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="xl:hidden absolute top-4 left-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#432818] mb-4">
                دسته‌بندی‌ها
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {categories.length === 0
                  ? Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-100 animate-pulse">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-3 w-8 bg-gray-200 rounded"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  : categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <div
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedCategory === category.id.toString()
                              ? "bg-[#432818]/10 text-[#432818]"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryChange(category.id.toString());
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {category.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({category.products_count})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              sx={{
                                color: "#7A4522",
                                "&.Mui-checked": {
                                  color: "#7A4522",
                                },
                              }}
                              checked={
                                selectedCategory === category.id.toString()
                              }
                              onChange={() =>
                                handleCategoryChange(category.id.toString())
                              }
                            />
                            <svg
                              className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                openCategories.includes(category.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(category.id);
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>

                        <div
                          className={`pr-4 space-y-2 border-r border-gray-200 overflow-hidden transition-all duration-300 ${
                            openCategories.includes(category.id)
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {category.categories.map((subCategory) => (
                            <label
                              key={subCategory.id}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                selectedCategory === subCategory.id.toString()
                                  ? "bg-[#432818]/10 text-[#432818]"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {subCategory.title}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({subCategory.products_count})
                                </span>
                              </div>
                              <Checkbox
                                sx={{
                                  color: "#7A4522",
                                  "&.Mui-checked": {
                                    color: "#7A4522",
                                  },
                                }}
                                checked={
                                  selectedCategory === subCategory.id.toString()
                                }
                                onChange={() =>
                                  handleCategoryChange(
                                    subCategory.id.toString()
                                  )
                                }
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* فیلترهای داینامیک */}
            {selectedCategory && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-[#432818] mb-4">
                  فیلترها
                </h3>

                {isLoadingFilters ? (
                  // Loading state for filters
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* Price Range Slider */}
                    {filters.price_range && (
                      <div className="space-y-4 bg-white p-4 rounded-lg border border-[#7A4522]/10">
                        <h4 className="font-medium text-[#432818]">
                          محدوده قیمت
                        </h4>
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={filters.price_range.min}
                            max={filters.price_range.max}
                            sx={{
                              color: "#7A4522",
                              height: 4,
                              "& .MuiSlider-thumb": {
                                width: 20,
                                height: 20,
                                backgroundColor: "#fff",
                                border: "2px solid #7A4522",
                                "&:hover, &.Mui-focusVisible": {
                                  boxShadow:
                                    "0 0 0 8px rgba(122, 69, 34, 0.16)",
                                },
                                "&.Mui-active": {
                                  width: 24,
                                  height: 24,
                                },
                              },
                              "& .MuiSlider-track": {
                                height: 4,
                                backgroundColor: "#7A4522",
                              },
                              "& .MuiSlider-rail": {
                                height: 4,
                                backgroundColor: "#7A4522",
                                opacity: 0.2,
                              },
                              "& .MuiSlider-valueLabel": {
                                backgroundColor: "#7A4522",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                "&:before": {
                                  display: "none",
                                },
                              },
                            }}
                          />
                          <div className="flex justify-between mt-4">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">
                                حداقل
                              </span>
                              <span className="text-sm font-medium text-[#7A4522] bg-[#FFF8E7] px-3 py-1 rounded-full">
                                {priceRange[0].toLocaleString()} تومان
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">
                                حداکثر
                              </span>
                              <span className="text-sm font-medium text-[#7A4522] bg-[#FFF8E7] px-3 py-1 rounded-full">
                                {priceRange[1].toLocaleString()} تومان
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Brands */}
                    {filters.brands && filters.brands.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-[#432818]">برندها</h4>
                        <div className="space-y-2">
                          {filters.brands.map((brand) => (
                            <label
                              key={brand.id}
                              className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  {brand.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  ({brand.count})
                                </span>
                              </div>
                              <Checkbox
                                sx={{
                                  color: "#7A4522",
                                  "&.Mui-checked": {
                                    color: "#7A4522",
                                  },
                                }}
                                checked={selectedBrands.includes(brand.id)}
                                onChange={() => handleBrandChange(brand.id)}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3">
            <ProductTopBar
              totalProducts={totalItems}
              onSortChange={handleSortChange}
              onSearch={handleSearchFunction}
              searchValue={searchQuery}
            />

            {/* نمایش وضعیت جستجو */}
            {searchQuery && (
              <div className="mb-4 p-4 bg-[#fff1cc] rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-[#7a4522]">
                    نتایج جستجو برای:{" "}
                    <span className="font-bold">{searchQuery}</span>
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      handleSearch("");
                    }}
                    className="text-[#7a4522] hover:text-[#432818] transition-colors"
                  >
                    پاک کردن جستجو
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#7A4522]/70">نتیجه‌ای یافت نشد</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {paginationLinks.length > 0 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-6 sm:mt-8">
                {paginationLinks.map((link, index) => {
                  const label = link.label
                    .replace(/&laquo;|&raquo;/g, "")
                    .trim();

                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(link.url)}
                      disabled={!link.url}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm ${
                        !link.url
                          ? "text-gray-400 cursor-not-allowed"
                          : link.active
                          ? "bg-[#432818] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      } transition-all duration-200`}
                      aria-label={
                        link.label.includes("قبلی") ? "صفحه قبلی" : "صفحه بعدی"
                      }
                    >
                      {link.label.includes("قبلی")
                        ? "←"
                        : link.label.includes("بعدی")
                        ? "→"
                        : label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* نمایش تعداد محصولات */}
            <div className="text-center text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm">
              نمایش {fromItem} تا {toItem} از {totalItems} محصول
            </div>
          </div>
        </div>

        {/* دکمه فیلتر فیکس شده */}
        {!isFilterOpen && (
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="xl:hidden fixed bottom-6 right-6 bg-[#432818] text-white p-4 rounded-full shadow-lg hover:bg-[#7A4522] transition-colors z-[2]"
          >
            <FaFilter className="w-6 h-6" />
          </button>
        )}

        {/* Overlay برای موبایل */}
        {isFilterOpen && (
          <div
            className="xl:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsFilterOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default ProductsPage;
