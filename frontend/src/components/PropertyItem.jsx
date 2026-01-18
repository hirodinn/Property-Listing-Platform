import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PropertyItem({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 group/card">
      <div className="relative h-80 bg-gray-200 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <>
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {property.images.map((img, index) => (
                <div key={index} className="w-full h-full shrink-0">
                  <img
                    src={img}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-opacity opacity-0 group-hover/card:opacity-100 z-10"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-opacity opacity-0 group-hover/card:opacity-100 z-10"
                >
                  <FaChevronRight size={16} />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white scale-110"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
            No Image
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[var(--color-accent)] text-white text-xs font-bold px-2 py-1 rounded z-10">
          {property.status === "published" ? "For Rent" : property.status}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-[var(--color-primary)] mb-1 truncate">
            {property.title}
          </h3>
          <span className="text-[var(--color-secondary)] font-bold">
            ${property.price.toLocaleString()}
            <span className="text-xs text-[var(--color-text-muted)]">/mo</span>
          </span>
        </div>

        <p className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] mb-3">
          <FaMapMarkerAlt size={12} /> {property.location}
        </p>

        <p className="text-sm text-[var(--color-text-main)] line-clamp-2 mb-4">
          {property.description}
        </p>

        <div className="border-t pt-3">
          <Link
            to={`/property/${property._id}`}
            className="block w-full text-center bg-[var(--color-bg-main)] text-[var(--color-text-main)] py-2 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyItem;
