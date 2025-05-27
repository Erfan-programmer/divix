import { useState, useEffect } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiEye,
  FiTrash2,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  is_available: boolean;
  stock: number;
  description: string;
  features?: string[];
}

interface ApiResponse {
  success: boolean;
  result: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const Favorites = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTokenExpiredModal, setShowTokenExpiredModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const fetchFavorites = async (page: number, signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://admin.mydivix.com/api/v1/favorites?per_page=20&page=${page}`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      if (response.status === 401) {
        setShowTokenExpiredModal(true);
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }, 3000);
        return;
      }

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات علاقه‌مندی‌ها");
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProducts(data.result.data);
        setTotalPages(data.result.last_page);
      } else {
        throw new Error("خطا در دریافت اطلاعات علاقه‌مندی‌ها");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "خطا در دریافت اطلاعات علاقه‌مندی‌ها"
      );
      toast.error("خطا در دریافت اطلاعات علاقه‌مندی‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(productToDelete);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://admin.mydivix.com/api/v1/favorites",
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productToDelete,
          }),
        }
      );

      if (response.status === 401) {
        setShowTokenExpiredModal(true);
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }, 3000);
        return;
      }

      if (!response.ok) {
        throw new Error("خطا در حذف محصول از علاقه‌مندی‌ها");
      }

      const data = await response.json();
      if (data.success) {
        toast.success("محصول با موفقیت از علاقه‌مندی‌ها حذف شد");
        setProducts(products.filter((p) => p.id !== productToDelete));
      } else {
        throw new Error(data.message || "خطا در حذف محصول از علاقه‌مندی‌ها");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "خطا در حذف محصول از علاقه‌مندی‌ها"
      );
    } finally {
      setIsDeleting(null);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchFavorites(currentPage, abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-right">
                <th className="p-4 text-gray-500 font-medium">تصویر</th>
                <th className="p-4 text-gray-500 font-medium">نام محصول</th>
                <th className="p-4 text-gray-500 font-medium">وضعیت موجودی</th>
                <th className="p-4 text-gray-500 font-medium">قیمت</th>
                <th className="p-4 text-gray-500 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#432818",
            color: "#fff",
            borderRadius: "8px",
            padding: "16px",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">علاقه‌مندی‌ها</h2>
        <p className="text-gray-500">{products.length} محصول</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <FiHeart className="w-full h-full" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            لیست علاقه‌مندی‌های شما خالی است
          </h3>
          <p className="text-gray-500 mb-6">
            محصولات مورد علاقه خود را به این لیست اضافه کنید
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#432818] text-white rounded-lg hover:bg-[#7A4522] transition-colors"
          >
            <FiShoppingCart className="w-5 h-5" />
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-right">
                  <th className="p-4 text-gray-500 font-medium">تصویر</th>
                  <th className="p-4 text-gray-500 font-medium">نام محصول</th>
                  <th className="p-4 text-gray-500 font-medium">
                    وضعیت موجودی
                  </th>
                  <th className="p-4 text-gray-500 font-medium">قیمت</th>
                  <th className="p-4 text-gray-500 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="relative w-16 h-16">
                        <LazyLoadImage
                          effect="blur"
                          src={product.image}
                          alt={product.title}
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <h3 className="text-gray-900 font-bold truncate">
                        {product.title}
                      </h3>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          product.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.is_available ? "موجود" : "ناموجود"}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-[#7A4522] font-bold">
                        {product.price.toLocaleString()} تومان
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-2 text-gray-500 hover:text-[#7A4522] transition-colors"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          disabled={isDeleting === product.id}
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === product.id ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiTrash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-[#7A4522] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-[#432818] text-white"
                          : "text-gray-500 hover:text-[#7A4522]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-[#7A4522] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-4xl w-full mx-4">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/2">
                <div className="relative w-full aspect-square">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedProduct.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedProduct.is_available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedProduct.is_available ? "موجود" : "ناموجود"}
                  </span>
                  {selectedProduct.is_available && (
                    <span className="text-gray-500 text-sm">
                      {selectedProduct.stock} عدد در انبار
                    </span>
                  )}
                </div>
                <p className="text-[#7A4522] font-bold text-lg mb-4">
                  {selectedProduct.price.toLocaleString()} تومان
                </p>
                <p className="text-gray-600 mb-6">
                  {selectedProduct.description}
                </p>
                {selectedProduct.features &&
                  selectedProduct.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              حذف از علاقه‌مندی‌ها
            </h3>
            <p className="text-gray-600 mb-6">
              آیا مطمئن هستید که می‌خواهید این محصول را از لیست علاقه‌مندی‌های
              خود حذف کنید؟
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting !== null}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting !== null ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "حذف"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTokenExpiredModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              نشست شما منقضی شده است
            </h3>
            <p className="text-gray-600 mb-6">
              لطفاً دوباره وارد شوید تا بتوانید به حساب کاربری خود دسترسی داشته
              باشید.
            </p>
            <div className="flex justify-end">
              <Link
                to="/login"
                className="px-4 py-2 bg-[#432818] text-white rounded-lg hover:bg-[#7A4522] transition-colors"
              >
                ورود مجدد
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
