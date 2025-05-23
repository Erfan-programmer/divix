import React from "react";
import {
  FaArrowUp,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaCreditCard,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#fff1cc] text-[#7a4522] shadow-lg">
      <div className=" py-8">
        <div className="container">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <FaTruck className="text-3xl text-[#7a4522]" />
              <div>
                <h3 className="font-bold">ارسال رایگان</h3>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <FaShieldAlt className="text-3xl text-[#7a4522]" />
              <div>
                <h3 className="font-bold">ضمانت اصالت</h3>
                <p className="text-sm">ضمانت اصالت کالا</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <FaHeadset className="text-3xl text-[#7a4522]" />
              <div>
                <h3 className="font-bold">پشتیبانی ۲۴ ساعته</h3>
                <p className="text-sm">پاسخگویی در تمام ساعات</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <FaCreditCard className="text-3xl text-[#7a4522]" />
              <div>
                <h3 className="font-bold">پرداخت امن</h3>
                <p className="text-sm">پرداخت آنلاین و در محل</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بخش اصلی فوتر */}
      <div className="container">
        {/* بخش اول: لوگو و دکمه بازگشت به بالا */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 md:gap-0 justify-between items-center py-6 border-b border-[#7a4522]/20">
          <div className="flex items-center gap-3">
            <img
              src="/images/divix-logo-final.png"
              alt="دیویکس"
              className="dark:invert w-20"
            />
            <span className="text-lg font-[600]">فروشگاه چرم دیویکس</span>
          </div>
          <button
            className="flex cursor-pointer justify-center gap-4 items-center border-2 border-[#473e39] py-1 px-4 rounded-xl hover:bg-[#7a4522] hover:text-[#fff1cc] transition-colors duration-300"
            onClick={scrollToTop}
          >
            <span>بازگشت به بالا</span>
            <FaArrowUp className="text-xl" />
          </button>
        </div>

        {/* بخش دوم: لینک‌های سریع و دسته‌بندی‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 sm:gap-5 md:gap-0 py-8">
          {/* دسته‌بندی‌ها */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-center sm:text-right">دسته‌بندی‌ها</h3>
            <ul className="space-y-2 text-center sm:text-right">
              <li>
                <Link
                  to="/products?category=leather-bags"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  کیف چرم
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=leather-shoes"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  کفش چرم
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=leather-accessories"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  اکسسوری چرم
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=leather-clothing"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  پوشاک چرم
                </Link>
              </li>
            </ul>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-center sm:text-right">لینک‌های سریع</h3>
            <ul className="space-y-2 text-center sm:text-right">
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  وبلاگ
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-[#432818] transition-colors duration-300"
                >
                  شرایط و قوانین
                </Link>
              </li>
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-center sm:text-right">اطلاعات تماس</h3>
            <ul className="space-y-3 text-center sm:text-right">
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaPhone className="text-xl" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaEnvelope className="text-xl" />
                <span>info@divix.ir</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaMapMarkerAlt className="text-xl" />
                <span>تهران، خیابان ولیعصر</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaClock className="text-xl" />
                <span>شنبه تا پنجشنبه: ۹ صبح تا ۹ شب</span>
              </li>
            </ul>
          </div>

          {/* شبکه‌های اجتماعی و خبرنامه */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-center sm:text-right">شبکه‌های اجتماعی</h3>
            <div className="flex justify-center sm:justify-start gap-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#7a4522] text-[#fff1cc] hover:bg-[#432818] transition-colors duration-300"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#7a4522] text-[#fff1cc] hover:bg-[#432818] transition-colors duration-300"
              >
                <FaTelegram className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#7a4522] text-[#fff1cc] hover:bg-[#432818] transition-colors duration-300"
              >
                <FaWhatsapp className="text-xl" />
              </a>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-center sm:text-right">عضویت در خبرنامه</h3>
              <div className="flex justify-center sm:justify-start w-full">
                <input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  className=" px-4 py-2 rounded-r-full bg-[#473e39] text-[#ffff] placeholder-[#fff]  focus:outline-none focus:ring-2 focus:ring-transparent"
                />
                <button className="px-6 md:px-2 py-2 bg-amber-500 hover:bg-amber-600 transition-colors rounded-l-full">
                  عضویت
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* بخش سوم: کپی‌رایت */}
        <div className="py-4 border-t border-[#7a4522]/20 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} فروشگاه چرم دیویکس. تمامی حقوق محفوظ
            است.
          </p>
        </div>
      </div>
      <div className="bg-[#F3C1A0] text-center py-2">
        <p>طراحی شده توسط تیم برنامه نویسی جابتو</p>
        <a href="https://jobto.ir" target="_blank" className="font-bold">Jobto</a>
      </div>
    </footer>
  );
};

export default Footer;
