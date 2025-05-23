import {
  FaTruck,
  FaShieldAlt,
  FaShoppingCart,
  FaTag,
  FaShoppingBag,
  FaGift,
  FaCalculator,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

export interface CartProduct {
  id: number;
  title: string;
  price: {
    id: number;
    price: number;
    regular_price: number;
    sale_price: number;
    discount: null;
    discount_price: number;
    cart_max: number;
    cart_min: number;
    attributes: [];
  };
  sale_price: number;
  image: string;
  quantity: number;
  color: string;
  warranty: string;
  seller: string;
}

// interface CartResponse {
//   success: boolean;
//   message: string;
//   result: {
//     id: number;
//     cart_id: string;
//     discount_id: number | null;
//     total_discount: number;
//     shipping_cost: string;
//     shipping_cost_amount: number;
//     final_price: number;
//     weight: number;
//     products: CartProduct[];
//   }
// }

interface Province {
  id: number;
  name: string;
  name_en: string | null;
  latitude: string;
  longitude: string;
  ordering: number;
}

interface City {
  id: number;
  name: string;
  name_en: string | null;
  latitude: string;
  longitude: string;
  ordering: number;
}

interface FormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  province_id: string;
  city_id: string;
  address: {
    postal_code: string;
    address: string;
  };
  description: string;
  gateway: string;
  carrier_id: number;
  address_id: number;
}

export const ShippingCart = () => {
  const [cartData, setCartData] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    province_id: "",
    city_id: "",
    address: {
      postal_code: "",
      address: "",
    },
    description: "",
    gateway: "",
    carrier_id: 0,
    address_id: 0,
  });

  const [carriers] = useState<any[]>([
    {
      id: 1,
      name: "تیپاک",
      image: "/images/Tipax-Logo.svg",
    },
    {
      id: 2,
      name: "پست",
      image: "/images/Iran-Post-Logo.svg",
    },
  ]);

  const paymentGateways = [
    {
      id: "zarinpal",
      name: "زرین‌پال",
      image: "/images/Zarrinpal-Logo.svg",
      description: "پرداخت امن با درگاه زرین‌پال",
    },
  ];

  const calculateItemTotal = (item: CartProduct) => {
    return item.price.sale_price * item.quantity || 0;
  };

  const calculateCartTotal = () => {
    return cartData.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const calculateTotalRegularPrice = () => {
    return cartData.reduce(
      (total, item) => total + item.price.regular_price * item.quantity,
      0
    );
  };

  const calculateTotalProfit = () => {
    return calculateTotalRegularPrice() - calculateCartTotal();
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://admin.mydivix.com/api/v1/cart", {
        headers: {
          "cart-id": `${localStorage.getItem("cart-id")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setCartData(data.result.products);
        console.log("cartData", data.result.products);
      }
    } catch (err) {
      setError("خطا در دریافت اطلاعات سبد خرید");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getUserInfo = async () => {
      try {
        const response = await fetch("https://admin.mydivix.com/api/v1/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
          },
        });

        if (!response.ok) {
          throw new Error("خطا در دریافت اطلاعات کاربر");
        }

        const data = await response.json();
        console.log("user data:", data.result);

        if (data.success && data.result) {
          const userData = data.result;

          setFormData((prev) => ({
            ...prev,
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            username: userData.username || "",
            email: userData.email || "",
          }));

          if (userData.address) {
            const { province, city, postal_code, address } = userData.address;

            setSelectedProvinceId(province.id);
            setFormData((prev) => ({
              ...prev,
              province_id: province.id.toString(),
              city_id: city.id.toString(),
              address: {
                postal_code: postal_code || "",
                address: address || "",
              }
            }));

            const citiesResponse = await fetch(
              `https://admin.mydivix.com/api/v1/provinces/${province.id}/cities`,
              {
                headers: {
                  accept: "application/json",
                  "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (citiesResponse.ok) {
              const citiesData = await citiesResponse.json();
              setCities(citiesData.result.data);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("خطا در دریافت اطلاعات کاربر");
      }
    };

    if (token) {
      getUserInfo();
    }
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://admin.mydivix.com/api/v1/provinces",
          {
            headers: {
              accept: "application/json",
              "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("خطا در دریافت لیست استان‌ها");
        }

        const data = await response.json();
        setProvinces(data.result.data);
      } catch (err) {
        toast.error("خطا در دریافت لیست استان‌ها");
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchCities = async (provinceId: number) => {
      try {
        const response = await fetch(
          `https://admin.mydivix.com/api/v1/provinces/${provinceId}/cities`,
          {
            headers: {
              accept: "application/json",
              "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("خطا در دریافت لیست شهرها");
        }

        const data = await response.json();
        setCities(data.result.data);
      } catch (err) {
        toast.error("خطا در دریافت لیست شهرها");
      }
    };

    if (selectedProvinceId) {
      fetchCities(selectedProvinceId);
    } else {
      setCities([]);
    }
  }, [selectedProvinceId]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = parseInt(e.target.value);
    setSelectedProvinceId(provinceId);
    setFormData((prev) => ({
      ...prev,
      province_id: e.target.value,
      city_id: "",
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      city_id: e.target.value,
    }));
  };

  const handleSubmitOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
        return;
      }

      const userUpdateResponse = await fetch(
        "https://admin.mydivix.com/api/v1/user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: formData.username,
            email: formData.email,
          }),
        }
      );

      const userUpdateResult = await userUpdateResponse.json();
      if (!userUpdateResult.success) {
        throw new Error(
          userUpdateResult.message || "خطا در بروزرسانی اطلاعات کاربر"
        );
      }

      const addressUpdateResponse = await fetch(
        "https://admin.mydivix.com/api/v1/user/address",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
          },
          body: JSON.stringify({
            province_id: parseInt(formData.province_id),
            city_id: parseInt(formData.city_id),
            postal_code: formData.address.postal_code || "0000000000",
            address: formData.address.address,
          }),
        }
      );

      const addressUpdateResult = await addressUpdateResponse.json();
      if (!addressUpdateResult.success) {
        throw new Error(addressUpdateResult.message || "خطا در بروزرسانی آدرس");
      }

      const orderResponse = await fetch(
        "https://admin.mydivix.com/api/v1/orders",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "cart-id": `${localStorage.getItem("cart-id")}`,
          },
          body: JSON.stringify({
            gateway: formData.gateway,
            carrier_id: formData.carrier_id,
            address_id: addressUpdateResult.result.address.id,
            description: formData.description || "",
          }),
        }
      );

      const orderResult = await orderResponse.json();
      if (!orderResult.success) {
        throw new Error(orderResult.message || "خطا در ثبت سفارش");
      }

      toast.success("سفارش شما با موفقیت ثبت شد");

      if (orderResult.result?.payment_url) {
        window.location.href = orderResult.result.payment_url;
      } else {
        throw new Error("خطا در دریافت لینک پرداخت");
      }
    } catch (err) {
      console.error("Error in order submission:", err);
      toast.error(err instanceof Error ? err.message : "خطا در ثبت سفارش");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Cart Section */}
          <div className="lg:w-2/3">
            <div className="bg-[#FFF8E7] border border-[#7A4522]/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-[#7A4522]">
                اطلاعات سفارش
              </h2>
              <div className="space-y-6">
                {/* اطلاعات شخصی */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">نام</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#7A4522]/80 mb-2">
                    شماره همراه
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#7A4522]/80 mb-2">ایمیل</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                  />
                </div>

                {/* آدرس */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">
                      استان
                    </label>
                    <select
                      value={formData.province_id}
                      onChange={handleProvinceChange}
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    >
                      <option value="">انتخاب استان</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">شهر</label>
                    <select
                      value={formData.city_id}
                      onChange={handleCityChange}
                      disabled={!selectedProvinceId}
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none disabled:opacity-50 disabled:bg-[#7A4522]/5"
                    >
                      <option value="">انتخاب شهر</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">
                      کد پستی
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.address.postal_code}
                      onChange={handleAddressChange}
                      placeholder="کد پستی 10 رقمی"
                      maxLength={10}
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">
                      آدرس کامل
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address.address}
                      onChange={handleAddressChange}
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#7A4522]/80 mb-2">
                    توضیحات
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none resize-none"
                    placeholder="توضیحات اضافی برای سفارش..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#FFF8E7] border border-[#7A4522]/10 rounded-lg p-[1rem] backdrop-blur-sm sticky top-4">
              <h2 className="text-xl font-bold text-[#7A4522] mb-4">
                محصولات سبد خرید
              </h2>
              {/* Products List */}
              <div className="space-y-4 mb-6">
                {cartData.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white rounded-lg border border-[#7A4522]/10 hover:border-[#7A4522]/30 transition-all duration-300"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-[#7A4522]/20">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#7A4522] text-base font-medium mb-2 hover:text-[#5A3418] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[#7A4522]/70 flex items-center gap-2">
                            <FaTag className="text-[#7A4522]" />
                            قیمت واحد:
                          </span>
                          <span className="text-[#7A4522] font-medium">
                            {item.price.sale_price.toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#7A4522]/70 flex items-center gap-2">
                            <FaShoppingCart className="text-[#7A4522]" />
                            تعداد:
                          </span>
                          <span className="text-[#7A4522] font-medium">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#7A4522]/10">
                          <span className="text-[#7A4522]/70 flex items-center gap-2">
                            <FaCalculator className="text-[#7A4522]" />
                            جمع:
                          </span>
                          <span className="text-[#7A4522] font-bold">
                            {(
                              item.price.sale_price * item.quantity
                            ).toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[#7A4522] bg-white p-3 rounded-lg">
                  <span className="flex items-center gap-2">
                    <FaShoppingBag className="text-[#7A4522]" />
                    قیمت کالاها ({cartData.length})
                  </span>
                  <span className="text-[#7A4522] font-medium">
                    {calculateCartTotal().toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <div className="flex justify-between items-center text-green-600 bg-white p-3 rounded-lg">
                  <span className="flex items-center gap-2">
                    <FaGift className="text-[#7A4522]" />
                    سود شما از خرید
                  </span>
                  <span className="text-[#7A4522] font-medium">
                    {calculateTotalProfit().toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <div className="border-t border-[#7A4522]/10 pt-4">
                  <div className="flex justify-between items-center font-bold text-[#7A4522] bg-white p-3 rounded-lg">
                    <span className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-[#7A4522]" />
                      جمع سبد خرید
                    </span>
                    <span className="text-[#7A4522]">
                      {calculateCartTotal().toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>

                {/* انتخاب روش ارسال */}
                <div className="bg-white border border-[#7A4522]/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#7A4522] mb-4">
                    روش ارسال
                  </h3>
                  <div className="space-y-3">
                    {carriers.map((carrier) => (
                      <label
                        key={carrier.id}
                        className="flex justify-between items-center gap-4 p-4 bg-[#FFF8E7] rounded-lg border border-[#7A4522]/10 hover:border-[#7A4522]/30 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex-1 flex items-center gap-4">
                          <div className="w-16 h-16 p-2 bg-white rounded-lg flex items-center justify-center">
                            <img
                              src={carrier.image}
                              alt={carrier.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[#7A4522] font-medium">
                              {carrier.name}
                            </p>
                            <p className="text-[#7A4522]/70 text-sm mt-1">
                              {carrier.description}
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="carrier_id"
                          value={carrier.id}
                          checked={formData.carrier_id === carrier.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                carrier_id: parseInt(e.target.value),
                              }));
                            }
                          }}
                          className="w-5 h-5 rounded border-[#7A4522]/50 focus:ring-[#7A4522] text-[#7A4522]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* درگاه پرداخت */}
                <div>
                  <label className="block text-[#7A4522]/80 mb-2">
                    درگاه پرداخت
                  </label>
                  <div className="space-y-3">
                    {paymentGateways.map((gateway) => (
                      <label
                        key={gateway.id}
                        className={`flex items-center gap-4 p-4 bg-[#FFF8E7] rounded-lg border transition-all duration-300 cursor-pointer ${formData.gateway === gateway.id
                            ? "border-[#7A4522]"
                            : "border-[#7A4522]/10 hover:border-[#7A4522]/30"
                          }`}
                      >
                        <input
                          type="radio"
                          name="gateway"
                          value={gateway.id}
                          checked={formData.gateway === gateway.id}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              gateway: e.target.value,
                            }))
                          }
                          className="hidden"
                        />
                        <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center">
                          <img
                            src={gateway.image}
                            alt={gateway.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#7A4522] font-medium">
                            {gateway.name}
                          </p>
                          <p className="text-[#7A4522]/70 text-sm mt-1">
                            {gateway.description}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gateway === gateway.id
                              ? "border-[#7A4522] bg-[#7A4522]"
                              : "border-[#7A4522]/30"
                            }`}
                        >
                          {formData.gateway === gateway.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={
                    !formData.first_name ||
                    !formData.last_name ||
                    !formData.username ||
                    !formData.province_id ||
                    !formData.city_id ||
                    !formData.address.postal_code ||
                    !formData.address.address ||
                    !formData.description ||
                    !formData.carrier_id ||
                    !formData.gateway ||
                    !acceptTerms
                  }
                  className={`w-full py-3 rounded-lg transition duration-300 ${formData.first_name &&
                      formData.last_name &&
                      formData.username &&
                      formData.province_id &&
                      formData.city_id &&
                      formData.address.postal_code &&
                      formData.address.address &&
                      formData.description &&
                      formData.carrier_id &&
                      formData.gateway &&
                      acceptTerms
                      ? "bg-[#7A4522] text-white font-bold hover:bg-[#5A3418] hover:shadow-lg hover:shadow-[#7A4522]/20"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  ثبت سفارش
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
                <div className="flex items-center gap-3 text-sm text-[#7A4522]/70 bg-white p-3 rounded-lg">
                  <FaTruck className="text-[#7A4522]" />
                  <span>ارسال دیویکس</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#7A4522]/70 bg-white p-3 rounded-lg">
                  <FaShieldAlt className="text-[#7A4522]" />
                  <span>گارانتی ۱۸ ماهه زرین سرویس امید</span>
                </div>
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
        <div className="bg-secondary-black-light border border-primary-gold/10 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
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
            <FaShoppingCart className="text-primary-gold text-6xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-white mb-2">
              سبد خرید شما خالی است
            </h2>
            <p className="text-gray-400 mb-6">
              می‌توانید برای مشاهده محصولات به صفحه اصلی بروید
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-gold to-primary-gold-dark text-secondary-black font-bold rounded-lg transition duration-300 hover:shadow-lg hover:shadow-primary-gold/20"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#7a4522",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
          duration: 2000,
        }}
      />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Cart Section */}
          <div className="lg:w-2/3">
            <div className="bg-[#FFF8E7] border border-[#7A4522]/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-[#7A4522]">
                اطلاعات سفارش
              </h2>

              <div className="space-y-6">
                {/* اطلاعات شخصی */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">نام</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#7A4522]/80 mb-2">
                    شماره همراه
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#7A4522]/80 mb-2">ایمیل</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                  />
                </div>

                {/* آدرس */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">استان</label>
                    <select
                      value={formData.province_id}
                      onChange={handleProvinceChange}
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    >
                      <option value="">انتخاب استان</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">شهر</label>
                    <select
                      value={formData.city_id}
                      onChange={handleCityChange}
                      disabled={!selectedProvinceId}
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none disabled:opacity-50 disabled:bg-[#7A4522]/5"
                    >
                      <option value="">انتخاب شهر</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">
                      کد پستی
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.address.postal_code}
                      onChange={handleAddressChange}
                      placeholder="کد پستی 10 رقمی"
                      maxLength={10}
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#7A4522]/80 mb-2">
                      آدرس کامل
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address.address}
                      onChange={handleAddressChange}
                      className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#7A4522]/80 mb-2">توضیحات</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none resize-none"
                    placeholder="توضیحات اضافی برای سفارش..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#FFF8E7] border border-[#7A4522]/10 rounded-lg p-[1rem] backdrop-blur-sm sticky top-4">
              <h2 className="text-xl font-bold text-[#7A4522] mb-4">
                محصولات سبد خرید
              </h2>
              {/* Products List */}
              <div className="space-y-4 mb-6">
                {cartData.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white rounded-lg border border-[#7A4522]/10 hover:border-[#7A4522]/30 transition-all duration-300"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-[#7A4522]/20">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#7A4522] text-base font-medium mb-2 hover:text-[#5A3418] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[#7A4522]/70 flex items-center gap-2">
                            <FaTag className="text-[#7A4522]" />
                            قیمت واحد:
                          </span>
                          <span className="text-[#7A4522] font-medium">
                            {item.price.sale_price.toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#7A4522]/70 flex items-center gap-2">
                            <FaShoppingCart className="text-[#7A4522]" />
                            تعداد:
                          </span>
                          <span className="text-[#7A4522] font-medium">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#7A4522]/10">
                          <span className="text-[#7A4522]/70 flex items-center gap-2">
                            <FaCalculator className="text-[#7A4522]" />
                            جمع:
                          </span>
                          <span className="text-[#7A4522] font-bold">
                            {(
                              item.price.sale_price * item.quantity
                            ).toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[#7A4522] bg-white p-3 rounded-lg">
                  <span className="flex items-center gap-2">
                    <FaShoppingBag className="text-[#7A4522]" />
                    قیمت کالاها ({cartData.length})
                  </span>
                  <span className="text-[#7A4522] font-medium">
                    {calculateCartTotal().toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <div className="flex justify-between items-center text-green-600 bg-white p-3 rounded-lg">
                  <span className="flex items-center gap-2">
                    <FaGift className="text-[#7A4522]" />
                    سود شما از خرید
                  </span>
                  <span className="text-[#7A4522] font-medium">
                    {calculateTotalProfit().toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <div className="border-t border-[#7A4522]/10 pt-4">
                  <div className="flex justify-between items-center font-bold text-[#7A4522] bg-white p-3 rounded-lg">
                    <span className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-[#7A4522]" />
                      جمع سبد خرید
                    </span>
                    <span className="text-[#7A4522]">
                      {calculateCartTotal().toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>

                {/* انتخاب روش ارسال */}
                <div className="bg-white border border-[#7A4522]/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#7A4522] mb-4">
                    روش ارسال
                  </h3>
                  <div className="space-y-3">
                    {carriers.map((carrier) => (
                      <label
                        key={carrier.id}
                        className="flex justify-between items-center gap-4 p-4 bg-[#FFF8E7] rounded-lg border border-[#7A4522]/10 hover:border-[#7A4522]/30 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex-1 flex items-center gap-4">
                          <div className="w-16 h-16 p-2 bg-white rounded-lg flex items-center justify-center">
                            <img
                              src={carrier.image}
                              alt={carrier.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[#7A4522] font-medium">
                              {carrier.name}
                            </p>
                            <p className="text-[#7A4522]/70 text-sm mt-1">
                              {carrier.description}
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="carrier_id"
                          value={carrier.id}
                          checked={formData.carrier_id === carrier.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                carrier_id: parseInt(e.target.value),
                              }));
                            }
                          }}
                          className="w-5 h-5 rounded border-[#7A4522]/50 focus:ring-[#7A4522] text-[#7A4522]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* درگاه پرداخت */}
                <div>
                  <label className="block text-[#7A4522]/80 mb-2">
                    درگاه پرداخت
                  </label>
                  <div className="space-y-3">
                    {paymentGateways.map((gateway) => (
                      <label
                        key={gateway.id}
                        className={`flex items-center gap-4 p-4 bg-[#FFF8E7] rounded-lg border transition-all duration-300 cursor-pointer ${formData.gateway === gateway.id
                            ? "border-[#7A4522]"
                            : "border-[#7A4522]/10 hover:border-[#7A4522]/30"
                          }`}
                      >
                        <input
                          type="radio"
                          name="gateway"
                          value={gateway.id}
                          checked={formData.gateway === gateway.id}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              gateway: e.target.value,
                            }))
                          }
                          className="hidden"
                        />
                        <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center">
                          <img
                            src={gateway.image}
                            alt={gateway.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#7A4522] font-medium">
                            {gateway.name}
                          </p>
                          <p className="text-[#7A4522]/70 text-sm mt-1">
                            {gateway.description}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gateway === gateway.id
                              ? "border-[#7A4522] bg-[#7A4522]"
                              : "border-[#7A4522]/30"
                            }`}
                        >
                          {formData.gateway === gateway.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={
                    !formData.first_name ||
                    !formData.last_name ||
                    !formData.username ||
                    !formData.province_id ||
                    !formData.city_id ||
                    !formData.address.postal_code ||
                    !formData.address.address ||
                    !formData.description ||
                    !formData.carrier_id ||
                    !formData.gateway ||
                    !acceptTerms
                  }
                  className={`w-full py-3 rounded-lg transition duration-300 ${formData.first_name &&
                      formData.last_name &&
                      formData.username &&
                      formData.province_id &&
                      formData.city_id &&
                      formData.address.postal_code &&
                      formData.address.address &&
                      formData.description &&
                      formData.carrier_id &&
                      formData.gateway &&
                      acceptTerms
                      ? "bg-[#7A4522] text-white font-bold hover:bg-[#5A3418] hover:shadow-lg hover:shadow-[#7A4522]/20"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  ثبت سفارش
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
                <div className="flex items-center gap-3 text-sm text-[#7A4522]/70 bg-white p-3 rounded-lg">
                  <FaTruck className="text-[#7A4522]" />
                  <span>ارسال دیویکس</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#7A4522]/70 bg-white p-3 rounded-lg">
                  <FaShieldAlt className="text-[#7A4522]" />
                  <span>گارانتی ۱۸ ماهه زرین سرویس امید</span>
                </div>
              </div>

              {/* Modal Login */}
              {showLoginModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-secondary-black-light p-6 rounded-lg max-w-md w-full mx-4">
                    <h3 className="text-xl font-bold text-white mb-4">
                      ورود به حساب کاربری
                    </h3>
                    <p className="text-gray-400 mb-6">
                      برای تکمیل سفارش، لطفا وارد حساب کاربری خود شوید.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowLoginModal(false)}
                        className="flex-1 py-2 border border-primary-gold/50 text-primary-gold rounded-lg hover:bg-primary-gold/10 transition-colors"
                      >
                        انصراف
                      </button>
                      <Link
                        to="/login"
                        className="flex-1 py-2 bg-gradient-to-r from-primary-gold to-primary-gold-dark text-secondary-black font-bold rounded-lg text-center hover:shadow-lg hover:shadow-primary-gold/20 transition-all"
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
    </>
  );
};

export default ShippingCart;
