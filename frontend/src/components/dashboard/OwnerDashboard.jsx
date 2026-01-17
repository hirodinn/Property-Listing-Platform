import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getMyProperties,
  deleteProperty,
  publishProperty,
  reset,
} from "../../features/properties/propertySlice";
import Spinner from "../Spinner";
import { FaPlus, FaTrash, FaPen, FaEye, FaUpload } from "react-icons/fa";
import CreatePropertyForm from "./CreatePropertyForm";

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties, isLoading, isError, message } = useSelector(
    (state) => state.properties,
  );

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    dispatch(getMyProperties());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      dispatch(deleteProperty(id));
    }
  };

  const handlePublish = (id) => {
    if (
      window.confirm(
        "Are you ready to publish this property? It will be visible to everyone.",
      )
    ) {
      dispatch(publishProperty(id));
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // The propertySlice should already handle adding the new property to the state,
    // but if not, we might need to re-fetch or rely on the store update.
    // Based on slice logic: state.properties.push(action.payload) is there.
  };

  if (isLoading) {
    return <Spinner />;
  }

  const drafts = properties.filter((p) => p.status === "draft");
  const published = properties.filter((p) => p.status === "published");

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-lg text-[var(--color-primary)]">
            {property.title}
          </h4>
          <p className="text-sm text-[var(--color-secondary)]">
            {property.location}
          </p>
          <p className="text-sm font-semibold mt-1">
            ${property.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
        <Link
          to={`/property/${property._id}`}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm"
        >
          <FaEye /> View
        </Link>

        {property.status === "draft" && (
          <button
            onClick={() => handlePublish(property._id)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium text-sm"
          >
            <FaUpload /> Publish
          </button>
        )}

        <button
          onClick={() => handleDelete(property._id)}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">
          Owner Dashboard
        </h2>
        {/* We moved the create button logic to inside the Drafts section as per request, 
            or we can keep a broader button here too. User said "in the drafts there should be a create propery"
            so let's emphasize that one, but keeping the top one as a global action is usually good UX. 
            However, user specifically asked to remove navigation and put it in drafts.
            Let's keep this button but make it toggle the form in the drafts section.
        */}
        {!showCreateForm && (
          <button
            onClick={() => {
              dispatch(reset());
              setShowCreateForm(true);
            }}
            className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-medium shadow-md"
          >
            <FaPlus /> Create New Property
          </button>
        )}
      </div>

      {isError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {message}
        </div>
      )}

      <div className="space-y-10">
        {/* Drafts Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-bold text-gray-700">Drafts</h3>
            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
              {drafts.length}
            </span>
          </div>

          {/* Inline Create Form */}
          {showCreateForm && (
            <CreatePropertyForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {drafts.length > 0 ? (
            <div className="space-y-4">
              {drafts.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            !showCreateForm && (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
                <p className="text-gray-500 mb-4">No drafts currently.</p>
                <button
                  onClick={() => {
                    dispatch(reset());
                    setShowCreateForm(true);
                  }}
                  className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)] px-4 py-2 rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition"
                >
                  <FaPlus /> Start a New Draft
                </button>
              </div>
            )
          )}
        </section>

        {/* Published Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-bold text-green-700">Published</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              {published.length}
            </span>
          </div>

          {published.length > 0 ? (
            <div className="space-y-4">
              {published.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-gray-400 italic p-4 border border-gray-100 rounded-lg text-center">
              No published properties yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OwnerDashboard;
