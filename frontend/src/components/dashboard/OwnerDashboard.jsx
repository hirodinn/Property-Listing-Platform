import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getMyProperties,
  reset,
} from "../../features/properties/propertySlice";
import Spinner from "../Spinner";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const { properties, isLoading, isError, message } = useSelector(
    (state) => state.properties,
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyProperties());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      // dispatch(deleteProperty(id)) // Need to implement delete in slice/component action
      console.log("Delete feature coming soon", id);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          My Properties
        </h2>
        <Link
          to="/create-property"
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          <FaPlus /> Add New
        </Link>
      </div>

      {isError && <div className="text-red-500 mb-4">{message}</div>}

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex gap-4">
                <img
                  src={property.images[0] || "https://via.placeholder.com/150"}
                  alt={property.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-bold text-lg text-[var(--color-text-main)]">
                    {property.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)]">
                    {property.location}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${property.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 self-end md:self-center">
                <Link
                  to={`/property/${property._id}`}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                >
                  View
                </Link>
                {/* <button className="text-gray-600 hover:bg-gray-50 p-2 rounded"><FaEdit /></button> */}
                <button
                  onClick={() => handleDelete(property._id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-[var(--color-text-muted)] mb-4">
            You haven't listed any properties yet.
          </p>
          <Link
            to="/create-property"
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            Create your first listing
          </Link>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
