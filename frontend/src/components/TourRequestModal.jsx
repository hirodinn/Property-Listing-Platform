import { useState } from "react";
import { FaTimes, FaCalendarAlt, FaClock } from "react-icons/fa";

const TourRequestModal = ({ isOpen, onClose, onSubmit, propertyTitle }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ date, time, message });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-(--color-primary) text-white">
          <h2 className="text-xl font-bold">Request a Tour</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Scheduling a tour for:{" "}
            <span className="font-bold text-gray-700">{propertyTitle}</span>
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaCalendarAlt className="text-(--color-secondary)" /> Preferred
              Date
            </label>
            <input
              type="date"
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaClock className="text-(--color-secondary)" /> Preferred Time
            </label>
            <input
              type="time"
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Message (Optional)
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition h-24 resize-none"
              placeholder="Tell the owner when you're available or ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-(--color-primary) text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-(--color-primary)/30 active:scale-95 transition-all duration-200"
          >
            Confirm Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default TourRequestModal;
