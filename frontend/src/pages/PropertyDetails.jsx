import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProperty } from "../features/properties/propertySlice";
import Spinner from "../components/Spinner";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

function PropertyDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { property, isLoading, isError, message } = useSelector(
    (state) => state.properties,
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(getProperty(id));

    // Cleanup on unmount (optional, but good practice to clear single property state)
    // Actually reset() clears everything including list. We might want a clearCurrentProperty action
    // But for now, let's keep it simple.
  }, [dispatch, id, isError, message]);

  if (isLoading || !property) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-[var(--color-primary)] hover:underline flex items-center gap-1 font-medium"
      >
        &larr; Back to Properties
      </button>

      <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* New Header Section */}
        <div className="p-8 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--color-primary)] mb-3 leading-tight">
                {property.title}
              </h1>
              <p className="flex items-center gap-2 text-[var(--color-text-muted)] text-xl">
                <FaMapMarkerAlt className="text-[var(--color-secondary)]" />{" "}
                {property.location}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="text-4xl font-bold text-[var(--color-secondary)]">
                ${property.price.toLocaleString()}
                <span className="text-lg text-[var(--color-text-muted)] font-normal ml-1">
                  /mo
                </span>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize shadow-sm ${
                  property.status === "published"
                    ? "bg-green-100 text-green-700"
                    : property.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {property.status}
              </div>
            </div>
          </div>
        </div>

        {/* Images Section - Large Grid */}
        <div className="p-8 border-b border-gray-100 bg-gray-50">
          {property.images && property.images.length > 0 ? (
            <div
              className={`grid gap-4 ${
                property.images.length === 1
                  ? "grid-cols-1"
                  : property.images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {property.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative group overflow-hidden rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md ${
                    index === 0 && property.images.length > 2
                      ? "md:col-span-2 md:row-span-2 h-[500px]"
                      : "h-[242px]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-200 h-[300px] flex items-center justify-center text-[var(--color-text-muted)] rounded-xl">
              No Images Available
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">
                Description
              </h3>
              <p className="text-[var(--color-text-main)] leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Sidebar / Owner Info or Contact */}
            <div className="bg-[var(--color-bg-main)] p-6 rounded-lg h-fit">
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4">
                Contact Agent
              </h3>
              {property.owner ? (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white">
                    {property.owner.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-text-main)]">
                      {property.owner.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {property.owner.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[var(--color-text-muted)] mb-4">
                  Owner information not available.
                </p>
              )}

              <button className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition">
                Request a Tour
              </button>
              <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
                Posted on {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
