import { useState, useEffect } from 'react';
import { FiPackage, FiEye, FiShoppingBag, FiChevronRight, FiChevronLeft, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

interface Order {
  id: number;
  name: string;
  address: string;
  shipping_cost: number;
  price: number;
  shipping_status: string;
  created_at: string;
  created_at_jalali: string;
  discount_amount: number;
}

interface OrdersResponse {
  success: boolean;
  message: string;
  result: {
    data: Order[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: {
        url: string | null;
        label: string;
        active: boolean;
      }[];
      path: string;
      per_page: string;
      to: number;
      total: number;
    };
  };
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<OrdersResponse['result']['meta'] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async (page: number, signal?: AbortSignal) => {
    try {
      const response = await fetch(`https://admin.mydivix.com/api/v1/orders?per_page=10&page=${page}`, {
        headers: {
          'Accept': 'application/json',
          'x-api-key': '9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        signal
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت سفارش‌ها');
      }

      const data: OrdersResponse = await response.json();
      
      if (data.success && data.result.data) {
        setOrders(data.result.data);
        setPagination(data.result.meta);
      } else {
        throw new Error(data.message || 'خطا در دریافت سفارش‌ها');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError('خطا در دریافت سفارش‌ها');
      console.error('Error fetching orders:', err);
      toast.error('خطا در دریافت سفارش‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchOrders(currentPage, abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // اسکلتون لودینگ برای جدول سفارش‌ها
  const OrdersTableSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-right">
              <th className="px-6 py-4 text-gray-500 font-medium sticky left-0 bg-gray-50">شماره سفارش</th>
              <th className="px-6 py-4 text-gray-500 font-medium">تاریخ ثبت</th>
              <th className="px-6 py-4 text-gray-500 font-medium">نام گیرنده</th>
              <th className="px-6 py-4 text-gray-500 font-medium">وضعیت</th>
              <th className="px-6 py-4 text-gray-500 font-medium">مبلغ کل</th>
              <th className="px-6 py-4 text-gray-500 font-medium sticky right-0 bg-gray-50">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900 sticky left-0 bg-white">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 sticky right-0 bg-white">
                  <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* اسکلتون پاگینیشن */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <OrdersTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <FiPackage className="w-12 h-12 text-[#7A4522]" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-gray-500">می‌توانید از محصولات متنوع ما دیدن کنید</p>
        </div>
        <Link 
          to="/products" 
          className="flex items-center gap-2 bg-[#432818] text-white px-6 py-3 rounded-lg hover:bg-[#7A4522] transition-colors"
        >
          <FiShoppingBag className="w-5 h-5" />
          <span>مشاهده محصولات</span>
        </Link>
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">سفارش‌های من</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-right">
                <th className="px-6 py-4 text-gray-500 font-medium sticky left-0 bg-gray-50">شماره سفارش</th>
                <th className="px-6 py-4 text-gray-500 font-medium">تاریخ ثبت</th>
                <th className="px-6 py-4 text-gray-500 font-medium">نام گیرنده</th>
                <th className="px-6 py-4 text-gray-500 font-medium">وضعیت</th>
                <th className="px-6 py-4 text-gray-500 font-medium">مبلغ کل</th>
                <th className="px-6 py-4 text-gray-500 font-medium sticky right-0 bg-gray-50">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 sticky left-0 bg-white">{order.id}</td>
                  <td className="px-6 py-4 text-gray-600">{order.created_at_jalali}</td>
                  <td className="px-6 py-4 text-gray-600">{order.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      order.shipping_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.shipping_status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.shipping_status === 'pending' ? 'در انتظار ارسال' :
                       order.shipping_status === 'delivered' ? 'تحویل شده' :
                       'لغو شده'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#7A4522] font-medium">
                    {(order.price + order.shipping_cost).toLocaleString()} تومان
                  </td>
                  <td className="px-6 py-4 sticky right-0 bg-white">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="flex justify-center items-center gap-2 text-[#7A4522] bg-yellow-50 px-2 py-1 rounded-lg hover:bg-yellow-100 transition-colors whitespace-nowrap"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-between px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">
                نمایش {pagination.from} تا {pagination.to} از {pagination.total} سفارش
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#7A4522] hover:text-[#7A4522] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
              {pagination.links.map((link, index) => {
                if (link.label === '&laquo; قبلی' || link.label === 'بعدی &raquo;') return null;
                const page = parseInt(link.label);
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      link.active
                        ? 'bg-[#432818] text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#7A4522] hover:text-[#7A4522] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Order Details */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">جزئیات سفارش #{selectedOrder.id}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* اطلاعات سفارش */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-gray-900 font-bold mb-4">اطلاعات سفارش</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">تاریخ ثبت:</p>
                      <p className="text-gray-900">{selectedOrder.created_at_jalali}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">وضعیت:</p>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        selectedOrder.shipping_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.shipping_status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedOrder.shipping_status === 'pending' ? 'در انتظار ارسال' :
                         selectedOrder.shipping_status === 'delivered' ? 'تحویل شده' :
                         'لغو شده'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* اطلاعات گیرنده */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-gray-900 font-bold mb-4">اطلاعات گیرنده</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">نام گیرنده:</p>
                      <p className="text-gray-900">{selectedOrder.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">آدرس:</p>
                      <p className="text-gray-900">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                {/* اطلاعات مالی */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-gray-900 font-bold mb-4">اطلاعات مالی</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">مبلغ سفارش:</p>
                      <p className="text-gray-900">{selectedOrder.price.toLocaleString()} تومان</p>
                    </div>
                    <div>
                      <p className="text-gray-500">هزینه ارسال:</p>
                      <p className="text-gray-900">{selectedOrder.shipping_cost.toLocaleString()} تومان</p>
                    </div>
                    {selectedOrder.discount_amount > 0 && (
                      <div>
                        <p className="text-gray-500">تخفیف:</p>
                        <p className="text-green-600">{selectedOrder.discount_amount.toLocaleString()} تومان</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">مبلغ کل:</p>
                      <p className="text-[#7A4522] font-bold">
                        {(selectedOrder.price + selectedOrder.shipping_cost).toLocaleString()} تومان
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 