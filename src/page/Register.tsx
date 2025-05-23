import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaHome,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    password_confirmation: "",
    email: "",
    device_name: "iphone 15",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);

    try {
      const response = await fetch(
        `https://admin.mydivix.com/api/v1/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

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
          toast.error(data.message || "خطا در ثبت‌نام", {
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

      // ذخیره توکن و اطلاعات کاربر
      localStorage.setItem("divix_token", data.result.token);
      localStorage.setItem("user", JSON.stringify(data.result.user));

      toast.success("ثبت‌نام با موفقیت انجام شد", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // ریدایرکت به صفحه کاربری
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white to-white flex items-center justify-center">
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
      <ToastContainer />
      <div className="absolute top-4 left-4">
        <Link
          to={"/"}
          className="flex justify-center items-center text-[#432818]"
        >
          <FaHome fontSize={22} />
        </Link>
      </div>
      <div className=" w-full">
        <div className="grid grid-cols-1 w-full lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block relative h-[100vh]  overflow-hidden shadow-lg">
            <img
              src="/images/header_image.jpg"
              alt="ورود به حساب کاربری"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#432818]/60 flex items-center justify-center p-8">
              <div className="text-white text-center">
                <h2 className="text-3xl font-bold mb-4">
                  به خانواده ما بپیوندید
                </h2>
                <p className="text-lg mb-6">
                  ثبت‌نام کنید و از مزایای ویژه ما بهره‌مند شوید
                </p>
                <p className="text-sm opacity-90">
                  اگر قبلاً ثبت‌نام کرده‌اید، می‌توانید وارد شوید
                </p>
                <Link
                  to="/login"
                  className="inline-block mt-4 px-6 py-2 bg-white text-[#432818] rounded-lg font-medium hover:bg-[#FFF1CC] transition-colors"
                >
                  ورود
                </Link>
              </div>
            </div>
          </div>

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
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    placeholder="نام"
                    className="w-full pr-10 py-3 rounded-lg border border-gray-300 text-[#432818] focus:border-[#432818]   transition-all duration-300 text-sm"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    placeholder="نام خونوادگی"
                    className="w-full pr-10 py-3 rounded-lg border border-gray-300 text-[#432818] focus:border-[#432818]   transition-all duration-300 text-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="ایمیل"
                    className="w-full pr-10 py-3 rounded-lg border border-gray-300 text-[#432818] focus:border-[#432818]   transition-all duration-300 text-sm"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                    <FaPhone />
                  </div>
                  <input
                    type="tell"
                    name="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="شماره همراه"
                    className="w-full pr-10 py-3 rounded-lg border border-gray-300 text-[#432818] focus:border-[#432818]   transition-all duration-300 text-sm"
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="رمز عبور"
                    className="w-full pr-10 py-3 rounded-lg border border-gray-300 text-[#432818] focus:border-[#432818]   transition-all duration-300 text-sm"
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

                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4522]">
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password_confirmation: e.target.value,
                      }))
                    }
                    placeholder="تکرار رمز عبور"
                    className="w-full pr-10 py-3 rounded-lg border border-gray-300 text-[#432818] focus:border-[#432818]   transition-all duration-300 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full py-3 hover:bg-[#432818] text-white rounded-lg font-medium bg-[#7A4522] transition-colors"
              >
                {isLoading ? "در حال ثبت‌نام..." : "ثبت نام"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
