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

  const inputStyle = {
    backgroundColor: "var(--color-bg-input)",
    borderColor: "var(--color-border)",
    color: "var(--color-text-main)",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Header: always dark bar in both themes */}
        <div
          className="p-6 flex justify-between items-center"
          style={{
            backgroundColor: "var(--color-inverse-bg)",
            color: "var(--color-inverse-text)",
          }}
        >
          <h2 className="text-xl font-bold">Request a Tour</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:opacity-80 transition text-inherit"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Scheduling a tour for:{" "}
            <span className="font-semibold" style={{ color: "var(--color-text-main)" }}>{propertyTitle}</span>
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-semibold flex items-center gap-2" style={{ color: "var(--color-text-main)" }}>
              <FaCalendarAlt style={{ color: "var(--color-secondary)" }} /> Preferred Date
            </label>
            <input
              type="date"
              required
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] transition"
              style={inputStyle}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold flex items-center gap-2" style={{ color: "var(--color-text-main)" }}>
              <FaClock style={{ color: "var(--color-secondary)" }} /> Preferred Time
            </label>
            <input
              type="time"
              required
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] transition"
              style={inputStyle}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
              Message (optional)
            </label>
            <textarea
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] transition h-24 resize-none placeholder:opacity-70"
              style={inputStyle}
              placeholder="When you're available or any questions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Button: same dark bar style as header for consistency */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold transition-all hover:opacity-95 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)]"
            style={{
              backgroundColor: "var(--color-inverse-bg)",
              color: "var(--color-inverse-text)",
            }}
          >
            Confirm Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default TourRequestModal;
