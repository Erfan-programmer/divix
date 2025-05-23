import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaTruck,
  FaShieldAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../../ContextApi/CartProvider";
import { updateCartItemQuantity } from "../../utils/Cart";

interface Attribute {
  id: number;
  name: string;
  value: string;
  group: {
    type: string;
  };
}

interface CartItem {
  id: number;
  title: string;
  price: {
    id: number;
    price: number;
    regular_price: number;
    sale_price: number;
    discount: boolean;
    discount_price: number;
    cart_max: number;
    cart_min: number;
    attributes: Attribute[];
  };
  quantity: number;
  image: string;
}

export default function ChechoutCart() {
  const { cartData, fetchCart, removeItem } = useCart() as {
    cartData: CartItem[];
    fetchCart: () => Promise<void>;
    handleQuantityChange: (id: number, quantity: number) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
  };
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [updatingItems, setUpdatingItems] = useState<Record<number, boolean>>(
    {}
  );
  const isMounted = useRef(false);

  const calculateItemTotal = useCallback((item: CartItem) => {
    return item.price.sale_price * item.quantity || 0;
  }, []);

  const calculateCartTotal = useCallback(() => {
    return cartData.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  }, [cartData, calculateItemTotal]);

  const calculateTotalRegularPrice = useCallback(() => {
    return cartData.reduce(
      (total, item) => total + item.price.regular_price * item.quantity,
      0
    );
  }, [cartData]);

  const calculateTotalProfit = useCallback(() => {
    return calculateTotalRegularPrice() - calculateCartTotal();
  }, [calculateTotalRegularPrice, calculateCartTotal]);

  useEffect(() => {
    isMounted.current = true;
    const loadCart = async () => {
      try {
        setIsLoading(true);
        await fetchCart();
      } catch (err) {
        setError("خطا در دریافت اطلاعات سبد خرید");
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const navigate = useNavigate();
  const handleCheckout = useCallback(() => {
    if (!acceptTerms) {
      toast.error("لطفا قوانین و مقررات را بپذیرید");
      return;
    }

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    navigate("/checkout/shipping");
  }, [acceptTerms, isLoggedIn]);

  const handleRemoveItemWrapper = useCallback(
    async (id: number) => {
      try {
        setUpdatingItems((prev) => ({ ...prev, [id]: true }));
        await removeItem(id);
      } finally {
        setUpdatingItems((prev) => ({ ...prev, [id]: false }));
      }
    },
    [removeItem]
  );

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    try {
      setUpdatingItems((prev) => ({ ...prev, [productId]: true }));
      const currentItem = cartData.find((item) => item.price.id === productId);
      if (!currentItem) return;

      const isDecrease = newQuantity < currentItem.quantity;
      const endpoint = isDecrease
        ? "https://admin.mydivix.com/api/v1/cart/decrease"
        : "https://admin.mydivix.com/api/v1/cart";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cart-id": `${localStorage.getItem("cart-id")}`,
        },
        body: JSON.stringify({
          price_id: productId,
          quantity: 1,
        }),
      });

      if (response.status === 422) {
        toast.error('تعداد محصول در انبار تمام شده است');
        return;
      }

      const data = await response.json();

      if (data.success) {
        if (
          data.result?.id &&
          data.result.id !== localStorage.getItem("cart-id")
        ) {
          localStorage.setItem("cart-id", data.result.id);
        }
        await updateCartItemQuantity(productId, newQuantity);
        await fetchCart();
        toast.success("تعداد محصول با موفقیت بروزرسانی شد");
      } else {
        console.error("خطا در بروزرسانی تعداد:", data.message);
        toast.error("تعداد این محصول در انبار به پایان رسیده است");
      }
    } catch (error) {
      console.error("خطا در ارتباط با سرور:", error);
      toast.error("خطا در بروزرسانی تعداد");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("لطفا کد تخفیف را وارد کنید");
      return;
    }

    setIsApplyingDiscount(true);
    try {
      const response = await fetch(
        "https://admin.mydivix.com/api/v1/cart/discount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            code: discountCode.trim(),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setDiscountAmount(data.result.total_discount);
        toast.success("کد تخفیف با موفقیت اعمال شد");
        await fetchCart();
      } else {
        toast.error(data.message || "کد تخفیف نامعتبر است");
      }
    } catch (error) {
      toast.error("خطا در اعمال کد تخفیف");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async () => {
    try {
      const response = await fetch(
        "https://admin.mydivix.com/api/v1/cart/discount",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "cart-id": `${localStorage.getItem("cart-id")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setDiscountAmount(0);
        setDiscountCode("");
        toast.success("کد تخفیف با موفقیت حذف شد");
        await fetchCart();
      }
    } catch (error) {
      toast.error("خطا در حذف کد تخفیف");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Skeleton for Main Cart Section */}
          <div className="lg:w-2/3">
            <div className="bg-[#fff1cc] border border-[#7A4522]/10 rounded-lg p-6">
              <div className="h-8 w-48 bg-[#7A4522]/20 rounded-lg animate-pulse mb-6"></div>
              <div className="space-y-6">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="py-6 flex flex-col sm:flex-row gap-4 border-b border-[#7A4522]/10"
                  >
                    <div className="w-full sm:w-24 h-24 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 w-3/4 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                      <div className="h-4 w-1/3 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skeleton for Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#fff1cc] border border-[#7A4522]/10 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-24 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-24 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                </div>
                <div className="border-t border-[#7A4522]/10 pt-4">
                  <div className="flex justify-between">
                    <div className="h-5 w-32 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                    <div className="h-5 w-24 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="h-12 w-full bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!cartData || cartData.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-[#fff1cc] border border-[#7A4522]/10 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[.1] m-4"
            style={{
              backgroundImage: "url(/images/logo.webp)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              filter: "grayscale(1)",
            }}
          />
          <div className="relative z-10 text-center">
            <FaShoppingCart className="text-[#7A4522] text-6xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-[#7A4522] mb-2">
              سبد خرید شما خالی است
            </h2>
            <p className="text-[#7A4522]/70 mb-6">
              می‌توانید برای مشاهده محصولات به صفحه اصلی بروید
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#7A4522] text-white font-bold rounded-lg transition duration-300 hover:bg-[#5A3418] hover:shadow-lg hover:shadow-[#7A4522]/20"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Cart Section */}
        <div className="lg:w-2/3">
          <div className="bg-[#fff1cc] border border-[#7A4522]/10 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl text-right font-bold mb-6 text-[#7A4522]">
              سبد خرید شما
            </h2>
            <div className="divide-y divide-[#7A4522]/10">
              {cartData.map((item) => (
                <div key={item.price.id} className="py-6 flex gap-4">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#7A4522]">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[#7A4522]/70 mb-2">
                      {item.price.attributes.map((attr) => (
                        <span key={attr.id} className="flex items-center gap-1">
                          {attr.group.type === "color" ? (
                            <div
                              className="w-3 h-3 rounded-full border border-[#fff1cc]"
                              style={{ backgroundColor: attr.value }}
                            />
                          ) : (
                            <span>{attr.name}</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-10 sm:gap-0 flex-wrap items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.price.id,
                              item.quantity + 1
                            )
                          }
                          disabled={updatingItems[item.price.id]}
                          className={`w-8 h-8 rounded-full border border-[#7A4522] text-[#7A4522] flex items-center justify-center transition-all duration-300 ${
                            updatingItems[item.price.id]
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-[#7A4522] hover:text-white"
                          }`}
                        >
                          {updatingItems[item.price.id] ? (
                            <div className="w-4 h-4 border-2 border-[#7A4522] border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaPlus size={12} />
                          )}
                        </button>
                        <span className="w-8 text-center text-[#7A4522]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.price.id,
                              item.quantity - 1
                            )
                          }
                          disabled={updatingItems[item.price.id]}
                          className={`w-8 h-8 rounded-full border border-[#7A4522] text-[#7A4522] flex items-center justify-center transition-all duration-300 ${
                            updatingItems[item.price.id]
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-[#7A4522] hover:text-white"
                          }`}
                        >
                          {updatingItems[item.price.id] ? (
                            <div className="w-4 h-4 border-2 border-[#7A4522] border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaMinus size={12} />
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveItemWrapper(item.price.id)}
                          disabled={updatingItems[item.price.id]}
                          className={`mr-4 transition-colors duration-300 ${
                            updatingItems[item.price.id]
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-red-400 hover:text-red-500"
                          }`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-[#7A4522]/50 line-through">
                          {(
                            item.price.regular_price * item.quantity
                          ).toLocaleString("fa-IR")}{" "}
                          تومان
                        </div>
                        <div className="font-bold text-[#7A4522]">
                          {calculateItemTotal(item).toLocaleString("fa-IR")}{" "}
                          تومان
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-[#fff1cc] border border-[#7A4522]/10 rounded-lg p-6 backdrop-blur-sm sticky top-4">
            <div className="space-y-4">
              <div className="flex justify-between text-[#7A4522]">
                <span>قیمت کالاها ({cartData.length})</span>
                <span>
                  {calculateCartTotal().toLocaleString("fa-IR")} تومان
                </span>
              </div>

              {/* کد تخفیف */}
              <div className="border-t border-[#7A4522]/10 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="کد تخفیف"
                    className="flex-1 px-3 py-2 border border-[#7A4522]/20 text-[#7A4522] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4522]/20"
                  />
                  {discountAmount > 0 ? (
                    <button
                      onClick={handleRemoveDiscount}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      حذف
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isApplyingDiscount
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#7A4522] text-white hover:bg-[#5A3418]"
                      }`}
                    >
                      {isApplyingDiscount ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "اعمال"
                      )}
                    </button>
                  )}
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 mt-2">
                    <span>تخفیف</span>
                    <span>{discountAmount.toLocaleString("fa-IR")} تومان</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-green-600">
                <span>سود شما از خرید</span>
                <span>
                  {calculateTotalProfit().toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <div className="border-t border-[#7A4522]/10 pt-4">
                <div className="flex justify-between font-bold text-[#7A4522]">
                  <span>جمع سبد خرید</span>
                  <span>
                    {(calculateCartTotal() - discountAmount).toLocaleString(
                      "fa-IR"
                    )}{" "}
                    تومان
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!acceptTerms}
                className={`w-full py-3 rounded-lg transition duration-300 ${
                  acceptTerms
                    ? "bg-[#7A4522] text-white font-bold hover:bg-[#5A3418] hover:shadow-lg hover:shadow-[#7A4522]/20"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                تکمیل سفارش
              </button>

              <div className="mt-4 flex items-center gap-2 text-sm text-[#7A4522]/70">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-[#7A4522]/50 focus:ring-[#7A4522] text-[#7A4522]"
                />
                <label htmlFor="acceptTerms">
                  <span>قوانین و مقررات سایت را می‌پذیرم</span>
                  <a
                    href="/terms"
                    className="text-[#7A4522] hover:underline mr-1"
                  >
                    (مشاهده قوانین)
                  </a>
                </label>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-[#7A4522]/70 bg-[#7A4522]/5 p-3 rounded-lg">
                <FaTruck className="text-[#7A4522]" />
                <span>ارسال دیویکس</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#7A4522]/70 bg-[#7A4522]/5 p-3 rounded-lg">
                <FaShieldAlt className="text-[#7A4522]" />
                <span>گارانتی ۱۸ ماهه زرین سرویس امید</span>
              </div>
            </div>

            {/* Modal Login */}
            {showLoginModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#fff1cc] p-6 rounded-lg max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold text-[#7A4522] mb-4">
                    ورود به حساب کاربری
                  </h3>
                  <p className="text-[#7A4522]/70 mb-6">
                    برای تکمیل سفارش، لطفا وارد حساب کاربری خود شوید.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowLoginModal(false)}
                      className="flex-1 py-2 border border-[#7A4522]/50 text-[#7A4522] rounded-lg hover:bg-[#7A4522]/10 transition-colors"
                    >
                      انصراف
                    </button>
                    <Link
                      to="/login"
                      className="flex-1 py-2 bg-[#7A4522] text-white font-bold rounded-lg text-center hover:bg-[#5A3418] hover:shadow-lg hover:shadow-[#7A4522]/20 transition-all"
                    >
                      ورود به حساب کاربری
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
