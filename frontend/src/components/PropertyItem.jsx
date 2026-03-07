import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { toggleFavorite } from "../features/auth/authSlice";
import { toast } from "react-toastify";

function PropertyItem({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isFavorited = user?.favorites?.includes(property._id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }

    dispatch(toggleFavorite(property._id));
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1,
    );
  };

  return (
    <Link
      to={`/property/${property._id}`}
      className="group/card block rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)]"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="relative h-72 bg-[var(--color-bg-main)] overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <>
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {property.images.map((img, index) => (
                <div key={index} className="w-full h-full shrink-0 overflow-hidden">
                  <img
                    src={img}
                    alt={`${property.title} - ${index + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                      index === currentImageIndex ? "group-hover/card:scale-105" : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover/card:opacity-100 z-10"
                >
                  <FaChevronLeft size={14} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover/card:opacity-100 z-10"
                >
                  <FaChevronRight size={14} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {property.images.map((_, index) => (
                    <span
                      key={index}
                      className={`block w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-sm font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            No Image
          </div>
        )}

        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white z-10"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          {property.status === "published" ? "For Rent" : property.status}
        </span>

        {user?.role === "user" && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 backdrop-blur-md transition z-20 text-white"
          >
            {isFavorited ? (
              <FaBookmark className="text-amber-400" size={18} />
            ) : (
              <FaRegBookmark size={18} />
            )}
          </button>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3
            className="text-lg font-bold truncate flex-1 min-w-0"
            style={{ color: "var(--color-text-main)" }}
          >
            {property.title}
          </h3>
          <span
            className="font-bold shrink-0 text-base"
            style={{ color: "var(--color-secondary)" }}
          >
            ${property.price.toLocaleString()}
            <span className="text-xs font-normal ml-0.5" style={{ color: "var(--color-text-muted)" }}>/mo</span>
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
          <FaMapMarkerAlt size={12} className="shrink-0 opacity-80" />
          <span className="truncate">{property.location}</span>
        </p>

        <p
          className="text-sm line-clamp-2 mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          {property.description}
        </p>

        <span
          className="inline-block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{
            backgroundColor: "var(--color-bg-main)",
            color: "var(--color-text-main)",
          }}
        >
          View Details
        </span>
      </div>
    </Link>
  );
}

export default PropertyItem;
