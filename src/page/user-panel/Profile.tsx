import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Breadcrumb from "../../components/Modules/Breadcrumb";
import { toast, Toaster } from "react-hot-toast";

interface Province {
  id: number;
  name: string;
  name_en: string | null;
}

interface City {
  id: number;
  name: string;
  name_en: string | null;
  latitude: string;
  longitude: string;
  ordering: number;
}

const Profile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    postal_code: "",
    province_id: "",
    city_id: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://admin.mydivix.com/api/v1/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.phone,
          email: formData.email
        })
      });

      if (response.ok) {
        toast.success("اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
        // به‌روزرسانی اطلاعات کاربر
        fetchUser();
      } else {
        const error = await response.json();
        toast.error(error.message || "خطا در به‌روزرسانی اطلاعات پروفایل");
      }
    } catch (error) {
      console.error("خطا در به‌روزرسانی اطلاعات پروفایل:", error);
      toast.error("خطا در به‌روزرسانی اطلاعات پروفایل");
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://admin.mydivix.com/api/v1/user/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          province_id: parseInt(formData.province_id),
          city_id: parseInt(formData.city_id),
          postal_code: formData.postal_code,
          address: formData.address
        })
      });

      if (response.ok) {
        toast.success("اطلاعات آدرس با موفقیت به‌روزرسانی شد");
        // به‌روزرسانی اطلاعات کاربر
        fetchUser();
      } else {
        const error = await response.json();
        toast.error(error.message || "خطا در به‌روزرسانی اطلاعات آدرس");
      }
    } catch (error) {
      console.error("خطا در به‌روزرسانی اطلاعات آدرس:", error);
      toast.error("خطا در به‌روزرسانی اطلاعات آدرس");
    }
  };

  const breadcrumbItems = [
    { title: "پنل کاربری", href: "/user-panel" },
    { title: "پروفایل" },
  ];

  const fetchUser = async (signal?: AbortSignal) => {
    try {
      const response = await fetch("https://admin.mydivix.com/api/v1/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        signal,
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.result;
        
        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone: userData.username,
          address: userData.address?.address || "",
          postal_code: userData.address?.postal_code || "",
          province_id: userData.address?.province?.id?.toString() || "",
          city_id: userData.address?.city?.id?.toString() || "",
        });

        if (userData.address?.province) {
          const province = {
            id: userData.address.province.id,
            name: userData.address.province.name,
            name_en: userData.address.province.name_en
          };
          setSelectedProvince(province);
          await fetchCities(province.id);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error("خطا در دریافت اطلاعات کاربر:", error);
      toast.error("خطا در دریافت اطلاعات کاربر");
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    
    const initializeData = async () => {
      await fetchProvinces(abortController.signal);
      await fetchUser(abortController.signal);
    };
    
    initializeData();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleSetPassword = async () => {
    try {
      const response = await fetch("https://admin.mydivix.com/api/v1/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          prev_password: passwordData.currentPassword,
          password: passwordData.newPassword,
          password_confirmation: passwordData.confirmPassword
        })
      });

      if (response.ok) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        toast.success("رمز عبور با موفقیت تغییر کرد");
      } else {
        const error = await response.json();
        toast.error(error.message || "خطا در تغییر رمز عبور");
      }
    } catch (error) {
      console.error("خطا در تغییر رمز عبور:", error);
      toast.error("خطا در تغییر رمز عبور");
    }
  };

  const fetchProvinces = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://admin.mydivix.com/api/v1/provinces', {
        headers: {
          'accept': 'application/json',
          'x-api-key': '9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        signal,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result.data) {
          setProvinces(data.result.data);
        } else {
          console.error('Invalid provinces data format:', data);
          toast.error("خطا در دریافت لیست استان‌ها");
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error("خطا در دریافت لیست استان‌ها:", error);
      toast.error("خطا در دریافت لیست استان‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCities = async (provinceId: number, signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://admin.mydivix.com/api/v1/provinces/${provinceId}/cities`, {
        headers: {
          'accept': 'application/json',
          'x-api-key': '9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        signal,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result.data) {
          const sortedCities = data.result.data.sort((a: City, b: City) => a.ordering - b.ordering);
          setCities(sortedCities);
        } else {
          console.error('Invalid cities data format:', data);
          toast.error("خطا در دریافت لیست شهرها");
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error("خطا در دریافت لیست شهرها:", error);
      toast.error("خطا در دریافت لیست شهرها");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const province = provinces.find(p => p.id.toString() === provinceId);
    setSelectedProvince(province || null);
    setFormData(prev => ({
      ...prev,
      province_id: provinceId,
      city_id: ""
    }));

    if (provinceId) {
      const abortController = new AbortController();
      await fetchCities(parseInt(provinceId), abortController.signal);
      return () => abortController.abort();
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    setFormData(prev => ({
      ...prev,
      city_id: cityId
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#432818',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Breadcrumb items={breadcrumbItems} />
      <div className="space-y-8">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#432818]">
          پروفایل کاربری
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* بخش آپلود تصویر */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative w-20 h-20">

              <div className="w-20 h-20 bg-[#432818] flex justify-center items-center rounded-full">
                <FaUser className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* فرم اطلاعات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                <FaUser className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="نام"
                className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
              />
            </div>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                <FaUser className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="نام خونولدگی"
                className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                <FaEnvelope className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ایمیل"
                className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                <FaPhone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="شماره موبایل"
                className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 bg-[#432818] text-white rounded-lg font-medium hover:bg-[#7A4522] transition-colors text-sm"
          >
            ذخیره تغییرات
          </button>
        </form>

        {/* فرم آدرس */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-lg sm:text-xl font-bold text-[#432818] mb-6">
            اطلاعات آدرس
          </h2>
          <form onSubmit={handleAddressSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative">
                <select
                  value={formData.province_id}
                  onChange={handleProvinceChange}
                  disabled={isLoading}
                  className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm disabled:bg-gray-100"
                >
                  <option value="">انتخاب استان</option>
                  {provinces.length > 0 ? (
                    provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>در حال بارگذاری...</option>
                  )}
                </select>
              </div>

              <div className="relative">
                <select
                  value={formData.city_id}
                  onChange={handleCityChange}
                  disabled={!selectedProvince || isLoading}
                  className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm disabled:bg-gray-100"
                >
                  <option value="">انتخاب شهر</option>
                  {cities.length > 0 ? (
                    cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {selectedProvince ? 'در حال بارگذاری...' : 'ابتدا استان را انتخاب کنید'}
                    </option>
                  )}
                </select>
              </div>

              <div className="relative sm:col-span-2">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                  <FaMapMarkerAlt className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="آدرس کامل"
                  className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="کد پستی"
                  className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 bg-[#432818] text-white rounded-lg font-medium hover:bg-[#7A4522] transition-colors text-sm"
            >
              ذخیره آدرس
            </button>
          </form>
        </div>

        {/* بخش تغییر پسورد */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-lg sm:text-xl font-bold text-[#432818] mb-6">
            تغییر رمز عبور
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSetPassword();
          }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                  <FaLock className="w-4 h-4" />
                </div>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="رمز عبور فعلی"
                  className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4522] hover:text-[#432818] transition-colors"
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                  <FaLock className="w-4 h-4" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="رمز عبور جدید"
                  className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4522] hover:text-[#432818] transition-colors"
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="relative sm:col-span-2">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                  <FaLock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="تکرار رمز عبور جدید"
                  className="w-full pr-10 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#7A4522] text-[#432818] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4522] hover:text-[#432818] transition-colors"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 bg-[#432818] text-white rounded-lg font-medium hover:bg-[#7A4522] transition-colors text-sm"
            >
              تغییر رمز عبور
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
