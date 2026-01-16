import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProperty, reset } from "../features/properties/propertySlice";
import Spinner from "../components/Spinner";

function CreateProperty() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
  });
  const [images, setImages] = useState([]); // File list

  const { title, description, location, price } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.properties,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("Property created successfully!");
      navigate("/properties");
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onMutate = (e) => {
    // Text inputs
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const onFileChange = (e) => {
    setImages(e.target.files);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const propertyData = new FormData();
    propertyData.append("title", title);
    propertyData.append("description", description);
    propertyData.append("location", location);
    propertyData.append("price", price);

    for (let i = 0; i < images.length; i++) {
      propertyData.append("images", images[i]);
    }

    dispatch(createProperty(propertyData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--color-bg-card)] p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary)] text-center">
          List Your Property
        </h1>
        <p className="text-[var(--color-text-muted)] text-center mb-8">
          Fill the form to publish a new property listing.
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="block text-[var(--color-text-main)] font-semibold mb-2"
              htmlFor="title"
            >
              Property Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none bg-white text-[var(--color-text-main)]"
              value={title}
              onChange={onMutate}
              placeholder="e.g. Luxury Condo in Downtown"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-[var(--color-text-main)] font-semibold mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none bg-white text-[var(--color-text-main)]"
              value={location}
              onChange={onMutate}
              placeholder="Address or City"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-[var(--color-text-main)] font-semibold mb-2"
              htmlFor="price"
            >
              Price (Monthly)
            </label>
            <input
              type="number"
              id="price"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none bg-white text-[var(--color-text-main)]"
              value={price}
              onChange={onMutate}
              placeholder="2500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-[var(--color-text-main)] font-semibold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none bg-white text-[var(--color-text-main)] h-32"
              value={description}
              onChange={onMutate}
              placeholder="Describe the property..."
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              className="block text-[var(--color-text-main)] font-semibold mb-2"
              htmlFor="images"
            >
              Images
            </label>
            <input
              type="file"
              id="images"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-secondary)] bg-white text-[var(--color-text-main)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-secondary)] file:text-white hover:file:bg-opacity-90"
              onChange={onFileChange}
              max="6"
              accept=".jpg,.png,.jpeg"
              multiple
              required
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Upload up to 6 images (jpg, png)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition transform active:scale-95"
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProperty;
