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
        {/* Images Section - Simple Grid for first 3 images for now */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px]">
          {property.images && property.images.length > 0 ? (
            <>
              <div className="h-full">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-rows-2 gap-2 h-full">
                {property.images[1] && (
                  <img
                    src={property.images[1]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {property.images[2] && (
                  <img
                    src={property.images[2]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {!property.images[1] && (
                  <div className="bg-gray-100 w-full h-full"></div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-[var(--color-text-muted)] col-span-2">
              No Images Available
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                {property.title}
              </h1>
              <p className="flex items-center gap-2 text-[var(--color-text-muted)] text-lg">
                <FaMapMarkerAlt /> {property.location}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold text-[var(--color-secondary)]">
                ${property.price.toLocaleString()}
                <span className="text-lg text-[var(--color-text-muted)] font-normal">
                  /mo
                </span>
              </div>
              <div className="mt-2 inline-block bg-[var(--color-accent)] text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {property.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
