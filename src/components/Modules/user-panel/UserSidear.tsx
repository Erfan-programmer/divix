"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
  FaComment,
  FaTicketAlt,
  FaBars,
  FaChevronDown,
  FaPlus,
  FaList,
  FaTimes,
} from "react-icons/fa";
import LogoutModal from "./LogoutModal";
const menuItems = [
  {
    title: "داشبورد",
    href: "/user-panel",
    icon: <FaUser className="w-5 h-5" />,
  },

  {
    title: "علاقه‌مندی‌ها",
    href: "/user-panel/favorites",
    icon: <FaHeart className="w-5 h-5" />,
  },
  {
    title: "پروفایل",
    href: "/user-panel/profile",
    icon: <FaUser className="w-5 h-5" />,
  },
  {
    title: "سفارش‌ها",
    href: "/user-panel/orders",
    icon: <FaShoppingBag className="w-5 h-5" />,
  },
];

const ticketItems = [
  {
    title: "تیکت جدید",
    icon: <FaPlus className="w-5 h-5" />,
    href: "/user-panel/ticket/send",
  },
  {
    title: "لیست تیکت‌ها",
    icon: <FaList className="w-5 h-5" />,
    href: "/user-panel/ticket/list",
  },
];

const UserSidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    first_name: string;
    last_name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // دریافت اطلاعات کاربر از localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserInfo({
          first_name: userData.first_name || "کاربر",
          last_name: userData.last_name,
          email: userData.email || "user@example.com",
        });
      } catch (error) {
        console.error("خطا در خواندن اطلاعات کاربر:", error);
      }
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // بررسی اینکه آیا مسیر فعلی مربوط به تیکت است
  const isTicketPath =
    location.pathname?.includes("/user-panel/ticket") ?? false;

  return (
    <>
      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-20 right-4 z-50 textg-[#432818] p-2 rounded-lg"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      )}

      <div
        className={`fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* نوار بالایی برای موبایل */}
      <div className="md:hidden fixed top-16 z-30 left-0 right-0 bg-[#fff] p-4 h-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#432818] flex items-center justify-center">
              <FaUser className="w-5 h-5 text-[#FFF1CC]" />
            </div>
            <div>
              <h3 className="font-bold text-[#432818] text-sm">
                {userInfo
                  ? `${userInfo.first_name} ${userInfo.last_name}`
                  : "کاربر"}
              </h3>
              <p className="text-xs text-[#432818]/70">
                {userInfo?.email || "user@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-[#432818] p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* سایدبار */}
      <div
        className={`
                fixed md:sticky md:top-4 h-[calc(100vh-4rem)] md:h-[80vh]
                top-16 md:top-4 left-0 w-92 min-w-[calc(fit-content + 3rem)] bg-[#432818] rounded-lg
                transform transition-transform duration-300 ease-in-out
                ${
                  isMobile
                    ? isSidebarOpen
                      ? "translate-x-0"
                      : "-translate-x-full"
                    : "translate-x-0"
                }
                z-40 md:z-0 flex flex-col
            `}
      >
        {/* بخش هدر که نباید اسکرول بشه */}
        <div className="hidden md:block p-6">
          <div className="flex flex-col justify-center rounded-full items-center space-x-4 p-4 bg-[#FFF1CC] rounded-xl">
            <div className="w-28 h-28 rounded-full bg-[#432818] flex items-center justify-center">
              <FaUser className="w-14 h-14 text-[#FFF1CC]" />
            </div>
            <div>
              <h3 className="font-bold text-[#432818] text-center">
                {userInfo
                  ? `${userInfo.first_name} ${userInfo.last_name}`
                  : "کاربر"}
              </h3>
              <p className="text-sm text-[#432818]/70 text-center">
                {userInfo?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* بخش منوها که باید اسکرول بشه */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFF1CC]/20 scrollbar-track-transparent">
          <div className="space-y-2 p-6">
            <nav className="space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 space-x-3 p-4 rounded-xl transition-all duration-300 ${
                    location.pathname === item.href
                      ? "bg-[#FFF1CC] text-[#432818] shadow-lg"
                      : "text-[#FFF1CC] hover:bg-[#FFF1CC]/10"
                  }`}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <div
                    className={`${
                      location.pathname === item.href
                        ? "text-[#432818]"
                        : "text-[#FFF1CC]"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}

              {/* آکاردئون تیکت‌ها */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsTicketOpen(!isTicketOpen)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    isTicketPath
                      ? "bg-[#FFF1CC] text-[#432818]"
                      : "text-[#FFF1CC] hover:bg-[#FFF1CC]/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaTicketAlt
                      className={`w-5 h-5 ${
                        isTicketPath ? "text-[#432818]" : "text-[#FFF1CC]"
                      }`}
                    />
                    <span className="font-medium">تیکت‌ها</span>
                  </div>
                  <FaChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isTicketOpen ? "rotate-180" : ""
                    } ${isTicketPath ? "text-[#432818]" : "text-[#FFF1CC]"}`}
                  />
                </button>

                {/* زیرمنوهای تیکت */}
                {isTicketOpen && (
                  <div className="space-y-2 pr-4">
                    {ticketItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                          location.pathname === item.href
                            ? "bg-[#FFF1CC] text-[#432818]"
                            : "text-[#FFF1CC] hover:bg-[#FFF1CC]/10"
                        }`}
                        onClick={() => isMobile && setIsSidebarOpen(false)}
                      >
                        <div
                          className={`${
                            location.pathname === item.href
                              ? "text-[#432818]"
                              : "text-[#FFF1CC]"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center space-x-3 p-4 gap-3 text-[#FFF1CC] hover:bg-[#FFF1CC]/10 rounded-xl transition-all duration-300 group"
            >
              <FaSignOutAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">خروج</span>
            </button>
          </div>
        </div>
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

export default UserSidebar;
