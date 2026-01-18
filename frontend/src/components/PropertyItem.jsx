import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

function PropertyItem({ property }) {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-48 bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
            No Image
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[var(--color-accent)] text-white text-xs font-bold px-2 py-1 rounded">
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
