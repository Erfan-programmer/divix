import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhone } from "react-icons/fa6";
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    device_name: "iPhone 12",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://admin.mydivix.com/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        if (data.errors) {
          toast.error("لطفا اطلاعات را به درستی وارد کنید", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error(data.message || "خطا در ورود", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        return;
      }

      localStorage.setItem("token", data.result.token);
      localStorage.setItem("user", JSON.stringify(data.result.user));

      toast.success("ورود با موفقیت انجام شد", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/user-panel");
    } catch (error) {
      toast.error("خطا در ارتباط با سرور", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } 
  };

  return (
    <div className="h-screen bg-white to-white flex items-center justify-center">
      <div className="absolute top-4 left-4">
        <Link
          to={"/"}
          className="flex justify-center items-center text-[#432818]"
        >
          <FaHome fontSize={22} />
        </Link>
      </div>
      <div className=" w-full ">
        <div className="grid grid-cols-1 w-full lg:grid-cols-2 gap-8 items-center">
          {/* تصویر سمت چپ */}
          <div className="hidden lg:block relative h-[100vh]  overflow-hidden shadow-lg">
            <img
              src="/images/header_image.jpg"
              alt="ورود به حساب کاربری"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#432818]/60 flex items-center justify-center p-8">
              <div className="text-white text-center">
                <h2 className="text-3xl font-bold mb-4">خوش آمدید</h2>
                <p className="text-lg mb-6">
                  به فروشگاه چرم‌های دست‌دوز خوش آمدید
                </p>
                <p className="text-sm opacity-90">
                  اگر حساب کاربری ندارید، می‌توانید ثبت‌نام کنید
                </p>
                <Link
                  to="/register"
                  className="inline-block mt-4 px-6 py-2 bg-white text-[#432818] rounded-lg font-medium hover:bg-[#FFF1CC] transition-colors"
                >
                  ثبت‌نام
                </Link>
              </div>
            </div>
          </div>

          {/* فرم ورود */}
          <div className=" rounded-xl h-screen flex flex-col w-full justify-center items-center">
            <img
              src="/images/divix-logo-final.png"
              alt="ورود به حساب کاربری"
              width={200}
              height={100}
            />

            <form onSubmit={handleSubmit} className=" w-[80%] p-6 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                    <FaPhone />
                  </div>
                  <input
                    type="tel"
                    name="tel"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }));
                    }}
                    placeholder="شماره همراه"
                    className="w-full pr-10 py-3 rounded-lg border border-gray-300 text-[#432818] focus:border-[#7A4522] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }}
                    placeholder="رمز عبور"
                    className="w-full pr-10 py-3 rounded-lg border text-[var(--primary)] border-gray-300 focus:border-[#7A4522] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 "
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4522]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-[#7A4522] border-gray-300 rounded focus:ring-[#7A4522]"
                  />
                  <label
                    htmlFor="remember"
                    className="mr-2 text-sm text-gray-600"
                  >
                    مرا به خاطر بسپار
                  </label>
                </div>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-[#7A4522] hover:text-[#432818]"
                >
                  فراموشی رمز عبور؟
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 hover:bg-[#432818] text-white rounded-lg font-medium bg-[#7A4522] transition-colors"
              >
                ورود به حساب کاربری
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
