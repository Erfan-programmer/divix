import { Fragment } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const handleLogout = async () => {
    const response = await fetch("https://admin.mydivix.com/api/v1/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
    const data = await response.json();
    if (data.status) {
      toast.success("شما با موفقیت خارج شدید");
    }
    console.log("Logging out...");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Fragment>
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
      {/* پس‌زمینه مودال */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* مودال */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#432818] p-6 text-right shadow-2xl transition-all duration-300">
          {/* آیکون هشدار */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#FFF1CC]/10 backdrop-blur-sm flex items-center justify-center border-2 border-[#FFF1CC]/20">
              <FaExclamationTriangle className="w-8 h-8 text-[#FFF1CC]" />
            </div>
          </div>

          {/* عنوان */}
          <h3 className="text-2xl font-bold leading-6 text-[#FFF1CC] text-center mb-2">
            خروج از حساب کاربری
          </h3>

          {/* متن توضیحات */}
          <div className="mt-4">
            <p className="text-[#FFF1CC]/80 text-center text-lg">
              آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
            </p>
          </div>

          {/* دکمه‌ها */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-xl border border-[#FFF1CC]/20 bg-[#FFF1CC]/10 px-6 py-3 text-base font-medium text-[#FFF1CC] hover:bg-[#FFF1CC]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF1CC]/50 focus-visible:ring-offset-2 transition-all duration-300"
              onClick={onClose}
            >
              انصراف
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-xl border border-transparent bg-[#FFF1CC] px-6 py-3 text-base font-medium text-[#432818] hover:bg-[#FFF1CC]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF1CC]/50 focus-visible:ring-offset-2 transition-all duration-300"
              onClick={handleLogout}
            >
              خروج
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LogoutModal;
