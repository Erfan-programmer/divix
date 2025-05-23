import { useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface TicketForm {
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
}

export const SendTicket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TicketForm>({
    title: "",
    message: "",
    priority: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://admin.mydivix.com/api/v1/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("تیکت شما با موفقیت ارسال شد");
        setFormData({
          title: "",
          message: "",
          priority: "medium",
        });
      } else {
        throw new Error(data.message || "خطا در ارسال تیکت");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ارسال تیکت");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full">
        <div className="bg-[#FFF8E7] border border-[#7A4522]/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#7A4522] mb-6">ارسال تیکت جدید</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#7A4522]/80 mb-2">عنوان تیکت</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
                placeholder="عنوان تیکت خود را وارد کنید"
                required
              />
            </div>

            <div>
              <label className="block text-[#7A4522]/80 mb-2">اولویت</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketForm["priority"] })}
                className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none"
              >
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">زیاد</option>
              </select>
            </div>

            <div>
              <label className="block text-[#7A4522]/80 mb-2">پیام</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white text-[#7A4522] px-4 py-2 rounded-lg border border-[#7A4522]/20 focus:border-[#7A4522] focus:ring-1 focus:ring-[#7A4522] focus:outline-none resize-none"
                rows={6}
                placeholder="پیام خود را وارد کنید"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#7A4522] text-white hover:bg-[#5A3418]"
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>در حال ارسال...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>ارسال تیکت</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendTicket; 