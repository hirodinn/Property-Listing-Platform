import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProperty,
  updateProperty,
  reset,
} from "../../features/properties/propertySlice";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const CreatePropertyForm = ({ onSuccess, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    price: initialData?.price || "",
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(
    initialData?.images || [],
  );

  const { title, description, location, price } = formData;

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.properties,
  );

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(
        initialData
          ? "Draft updated successfully!"
          : "Draft created successfully!",
      );
      onSuccess(); // Callback to parent to close form or refresh list
      dispatch(reset());
    }
  }, [isError, isSuccess, message, dispatch, onSuccess, initialData]);

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + files.length;

    if (totalImages > 6) {
      toast.error(
        `You can only have a maximum of 6 images. You have ${existingImages.length} existing images, so you can add up to ${6 - existingImages.length} more.`,
      );
      e.target.value = ""; // Clear the input
      setImages([]);
    } else {
      setImages(files);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (existingImages.length === 0 && images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const propertyData = new FormData();
    propertyData.append("title", title);
    propertyData.append("description", description);
    propertyData.append("location", location);
    propertyData.append("price", price);

    if (images) {
      Array.from(images).forEach((image) => {
        propertyData.append("images", image);
      });
    }

    if (initialData) {
      propertyData.append("keptImages", JSON.stringify(existingImages));
      propertyData.append("hasImageUpdates", "true");
    }

    console.log("propertyData", propertyData);

    if (initialData) {
      dispatch(updateProperty({ id: initialData._id, propertyData }));
    } else {
      dispatch(createProperty(propertyData));
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 mb-6 relative">
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <FaTimes size={20} />
      </button>

      <h3 className="text-xl font-bold mb-4 text-(--color-primary)">
        {initialData ? "Edit Draft" : "Start a New Draft"}
      </h3>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="title">
              Title *
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-(--color-primary) outline-none"
              value={title}
              onChange={onMutate}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="price">
              Price (Monthly) *
            </label>
            <input
              type="number"
              id="price"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-(--color-primary) outline-none"
              value={price}
              onChange={onMutate}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold mb-1"
            htmlFor="location"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-(--color-primary) outline-none"
            value={location}
            onChange={onMutate}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold mb-1"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-(--color-primary) outline-none h-24"
            value={description}
            onChange={onMutate}
            required
          ></textarea>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Existing Images</h4>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={img}
                    alt={`Existing ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingImages(
                        existingImages.filter((_, i) => i !== index),
                      )
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1" htmlFor="images">
            {initialData
              ? `Add More Images (Max ${6 - existingImages.length} more)`
              : "Images * (Max 6)"}
          </label>
          <input
            type="file"
            id="images"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-(--color-secondary) file:text-white hover:file:bg-opacity-90"
            onChange={onFileChange}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required={existingImages.length === 0}
            disabled={existingImages.length >= 6}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 font-semibold hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-(--color-primary) text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition"
          >
            {initialData ? "Update Draft" : "Create Draft"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePropertyForm;
