import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProperties, reset } from "../features/properties/propertySlice";
import PropertyItem from "../components/PropertyItem";
import Spinner from "../components/Spinner";

function Properties() {
  const dispatch = useDispatch();

  // Local state for filters (simplified for now)
  const [filters, setFilters] = useState({
    location: "",
  });

  const { properties, isLoading, isError, message } = useSelector(
    (state) => state.properties,
  );

  useEffect(() => {
    dispatch(getProperties(filters));

    return () => {
      dispatch(reset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Run once on mount. Search handles updates.

  useEffect(() => {
    if (isError) {
      console.error(message);
    }
  }, [isError, message]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getProperties(filters));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Search / Filter Section */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search by location..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] shadow-sm text-[var(--color-text-main)] bg-[var(--color-bg-card)]"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />
          <button
            type="submit"
            className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition"
          >
            Search
          </button>
        </form>
      </div>

      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyItem key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <h3 className="text-center text-[var(--color-text-muted)] mt-10">
          No properties found
        </h3>
      )}
    </div>
  );
}

export default Properties;
