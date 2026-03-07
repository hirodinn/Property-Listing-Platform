import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProperties, reset } from "../features/properties/propertySlice";
import PropertyItem from "../components/PropertyItem";
import Spinner from "../components/Spinner";
import { HiOutlineSearch } from "react-icons/hi";

function Properties() {
  const dispatch = useDispatch();

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
  }, [dispatch]);

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
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: "var(--color-text-main)" }}>
          Find your next place
        </h1>
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
          Browse listings and schedule tours in one place.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
      >
        <div className="relative flex-1">
          <HiOutlineSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-50"
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search by location..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
            style={{
              backgroundColor: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
              ["--tw-ring-color"]: "var(--color-secondary)",
            }}
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 rounded-xl font-semibold transition-all hover:opacity-95 active:scale-[0.98] shrink-0"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-light)",
          }}
        >
          Search
        </button>
      </form>

      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyItem key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-card)" }}>
          <p className="text-lg font-medium" style={{ color: "var(--color-text-muted)" }}>
            No properties found
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Try a different search or check back later.
          </p>
        </div>
      )}
    </div>
  );
}

export default Properties;
