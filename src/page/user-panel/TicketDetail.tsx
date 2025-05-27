import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationCircle, FaArrowRight } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface Message {
  id: number;
  message: string;
  user_id: number;
  created_at: string;
}

interface TicketDetail {
  id: number;
  title: string;
  status: "open" | "closed" | "pending";
  priority: "low" | "medium" | "high";
  messages: Message[];
}

export const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");

  const fetchTicketDetail = async (signal?: AbortSignal) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://admin.mydivix.com/api/v1/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
        },
        signal,
      });

      const data = await response.json();

      if (data.success) {
        setTicket(data.result.data);
      } else {
        throw new Error(data.message || "خطا در دریافت اطلاعات تیکت");
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      toast.error(error instanceof Error ? error.message : "خطا در دریافت اطلاعات تیکت");
      navigate("/user-panel/tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://admin.mydivix.com/api/v1/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("پیام شما با موفقیت ارسال شد");
        setNewMessage("");
        fetchTicketDetail();
      } else {
        throw new Error(data.message || "خطا در ارسال پیام");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ارسال پیام");
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchTicketDetail(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [ticketId]);

  const getStatusIcon = (status: TicketDetail["status"]) => {
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

  const getStatusText = (status: TicketDetail["status"]) => {
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

  const getPriorityColor = (priority: TicketDetail["priority"]) => {
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

  if (!ticket) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#FFF8E7] border border-[#7A4522]/10 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#7A4522] mb-2">{ticket.title}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <span className="text-sm text-[#7A4522]/70">
                    {getStatusText(ticket.status)}
                  </span>
                </div>
                <span className={`text-sm ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority === "high"
                    ? "اولویت بالا"
                    : ticket.priority === "medium"
                    ? "اولویت متوسط"
                    : "اولویت پایین"}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/user-panel/tickets")}
              className="text-[#7A4522] hover:text-[#5A3418] transition-colors"
            >
              بازگشت به لیست تیکت‌ها
            </button>
          </div>

          <div className="space-y-6">
            {ticket.messages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-lg p-4 border border-[#7A4522]/10"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#7A4522]/70">
                    {new Date(message.created_at).toLocaleDateString("fa-IR")}
                  </span>
                </div>
                <p className="text-[#7A4522]">{message.message}</p>
              </div>
            ))}
          </div>

          {ticket.status !== "closed" && (
            <form onSubmit={handleSendMessage} className="mt-6">
              <div className="mb-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none resize-none"
                  rows={4}
                  placeholder="پیام خود را وارد کنید"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#7A4522] text-white px-4 py-2 rounded-lg hover:bg-[#5A3418] transition-colors flex items-center justify-center gap-2"
              >
                <FaArrowRight />
                <span>ارسال پیام</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail; 