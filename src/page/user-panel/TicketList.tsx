import { useState, useEffect } from "react";
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Ticket {
  id: number;
  subject: string;
  priority: "low" | "medium" | "high";
  user_id: number;
  status: "open" | "closed" | "pending";
  created_at: string;
  updated_at: string;
}

interface TicketResponse {
  current_page: number;
  data: Ticket[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const TicketList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchTickets = async (page: number = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://admin.mydivix.com/api/v1/tickets?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
        },
      });

      const data: TicketResponse = await response.json();
      setTickets(data.data);
      setTotalPages(data.last_page);
      setCurrentPage(data.current_page);
    } catch (error) {
      toast.error("خطا در دریافت لیست تیکت‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusIcon = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return <FaClock className="text-yellow-500" />;
      case "closed":
        return <FaCheckCircle className="text-green-500" />;
      case "pending":
        return <FaExclamationCircle className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "باز";
      case "closed":
        return "بسته";
      case "pending":
        return "در انتظار";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="text-[#7A4522] text-4xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#7A4522]">تیکت‌های من</h2>
          <Link
            to="/user-panel/tickets/send"
            className="bg-[#7A4522] text-white px-4 py-2 rounded-lg hover:bg-[#5A3418] transition-colors"
          >
            ارسال تیکت جدید
          </Link>
        </div>

        <div className="bg-[#FFF8E7] border border-[#7A4522]/10 rounded-lg p-6">
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#7A4522]/70">شما هنوز هیچ تیکتی ارسال نکرده‌اید</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-lg p-4 border border-[#7A4522]/10 hover:border-[#7A4522]/30 transition-all cursor-pointer"
                    onClick={() => navigate(`/user-panel/tickets/${ticket.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-[#7A4522]">{ticket.subject}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className="text-sm text-[#7A4522]/70">
                          {getStatusText(ticket.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className={`${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === "high"
                          ? "اولویت بالا"
                          : ticket.priority === "medium"
                          ? "اولویت متوسط"
                          : "اولویت پایین"}
                      </span>
                      <span className="text-[#7A4522]/50">
                        {new Date(ticket.created_at).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => fetchTickets(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-[#7A4522]/20 text-[#7A4522] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7A4522]/5 transition-colors"
                  >
                    قبلی
                  </button>
                  <span className="px-3 py-1 text-[#7A4522]">
                    صفحه {currentPage} از {totalPages}
                  </span>
                  <button
                    onClick={() => fetchTickets(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border border-[#7A4522]/20 text-[#7A4522] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7A4522]/5 transition-colors"
                  >
                    بعدی
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketList; 