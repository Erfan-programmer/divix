import { FaCheckCircle, FaShoppingBag, FaHome, FaUser, FaTruck, FaMoneyBillWave, FaCreditCard, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface OrderDetails {
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  shippingMethod: string;
  estimatedDelivery: string;
}

export const ThankYou = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    orderNumber: "",
    totalAmount: 0,
    paymentMethod: "",
    shippingMethod: "",
    estimatedDelivery: "",
  });

  useEffect(() => {
    // در اینجا می‌توانید اطلاعات سفارش را از API دریافت کنید
    // فعلاً با داده‌های نمونه پر می‌کنیم
    setOrderDetails({
      orderNumber: "123456789",
      totalAmount: 2500000,
      paymentMethod: "زرین‌پال",
      shippingMethod: "تیپاک",
      estimatedDelivery: "3-5 روز کاری",
    });
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* پیام تشکر */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-[#FFF8E7] rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-[#7A4522] text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#7A4522] mb-4">
            سفارش شما با موفقیت ثبت شد
          </h1>
          <p className="text-[#7A4522]/70 text-lg">
            از خرید شما متشکریم. جزئیات سفارش به ایمیل شما ارسال خواهد شد.
          </p>
        </div>

        {/* جزئیات سفارش */}
        <div className="bg-[#FFF8E7] border border-[#7A4522]/10 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-[#7A4522] mb-6">جزئیات سفارش</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg">
              <span className="text-[#7A4522]/70 flex items-center gap-2">
                <FaShoppingBag className="text-[#7A4522]" />
                شماره سفارش:
              </span>
              <span className="text-[#7A4522] font-medium">{orderDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg">
              <span className="text-[#7A4522]/70 flex items-center gap-2">
                <FaMoneyBillWave className="text-[#7A4522]" />
                مبلغ کل:
              </span>
              <span className="text-[#7A4522] font-medium">
                {orderDetails.totalAmount.toLocaleString("fa-IR")} تومان
              </span>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg">
              <span className="text-[#7A4522]/70 flex items-center gap-2">
                <FaCreditCard className="text-[#7A4522]" />
                روش پرداخت:
              </span>
              <span className="text-[#7A4522] font-medium">{orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg">
              <span className="text-[#7A4522]/70 flex items-center gap-2">
                <FaTruck className="text-[#7A4522]" />
                روش ارسال:
              </span>
              <span className="text-[#7A4522] font-medium">{orderDetails.shippingMethod}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg">
              <span className="text-[#7A4522]/70 flex items-center gap-2">
                <FaCalendarAlt className="text-[#7A4522]" />
                زمان تحویل تخمینی:
              </span>
              <span className="text-[#7A4522] font-medium">{orderDetails.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* دکمه‌های راهنما */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-[#7A4522] text-white p-4 rounded-lg hover:bg-[#5A3418] transition-colors"
          >
            <FaHome />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
          <Link
            to="/profile/orders"
            className="flex items-center justify-center gap-2 bg-[#FFF8E7] text-[#7A4522] p-4 rounded-lg border border-[#7A4522]/20 hover:border-[#7A4522] transition-colors"
          >
            <FaUser />
            <span>مشاهده سفارش‌های من</span>
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 bg-[#FFF8E7] text-[#7A4522] p-4 rounded-lg border border-[#7A4522]/20 hover:border-[#7A4522] transition-colors"
          >
            <FaShoppingBag />
            <span>مشاهده محصولات</span>
          </Link>
        </div>

        {/* پیام پشتیبانی */}
        <div className="mt-12 text-center">
          <p className="text-[#7A4522]/70">
            در صورت بروز هرگونه مشکل، با پشتیبانی ما در تماس باشید
          </p>
          <a
            href="tel:02112345678"
            className="text-[#7A4522] font-medium hover:underline mt-2 inline-block"
          >
            021-12345678
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYou; 