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
      toast.error(message, { toastId: "property-error" });
    }

    if (isSuccess) {
      toast.success(
        initialData
          ? "Draft updated successfully!"
          : "Draft created successfully!",
        { toastId: "property-success" }, // Prevent duplicate toasts
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

  const inputClass = "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 transition text-base";
  const inputStyle = {
    backgroundColor: "var(--color-bg-input)",
    borderColor: "var(--color-border)",
    color: "var(--color-text-main)",
  };

  return (
    <div
      className="rounded-xl border p-6 relative"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 p-2 rounded-lg hover:opacity-80 transition"
        style={{ color: "var(--color-text-muted)" }}
        aria-label="Close"
      >
        <FaTimes size={20} />
      </button>

      <h3 className="text-xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>
        {initialData ? "Edit Draft" : "Start a New Draft"}
      </h3>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" htmlFor="title" style={{ color: "var(--color-text-main)" }}>Title *</label>
            <input type="text" id="title" className={inputClass} style={inputStyle} value={title} onChange={onMutate} required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" htmlFor="price" style={{ color: "var(--color-text-main)" }}>Price (Monthly) *</label>
            <input type="number" id="price" className={inputClass} style={inputStyle} value={price} onChange={onMutate} required />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1.5" htmlFor="location" style={{ color: "var(--color-text-main)" }}>Location *</label>
          <input type="text" id="location" className={inputClass} style={inputStyle} value={location} onChange={onMutate} required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1.5" htmlFor="description" style={{ color: "var(--color-text-main)" }}>Description *</label>
          <textarea id="description" className={`${inputClass} h-28 resize-none`} style={inputStyle} value={description} onChange={onMutate} required />
        </div>

        {existingImages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>Existing Images</h4>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={img} alt={`Existing ${index}`} className="w-full h-full object-cover rounded-lg border" style={{ borderColor: "var(--color-border)" }} />
                  <button
                    type="button"
                    onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1.5" htmlFor="images" style={{ color: "var(--color-text-main)" }}>
            {initialData ? `Add More Images (Max ${6 - existingImages.length} more)` : "Images * (Max 6)"}
          </label>
          <input
            type="file"
            id="images"
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer hover:file:opacity-90 transition file:bg-[var(--color-secondary)]"
            style={{ color: "var(--color-text-muted)" }}
            onChange={onFileChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required={existingImages.length === 0}
            disabled={existingImages.length >= 6}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl font-semibold hover:opacity-80 transition" style={{ color: "var(--color-text-muted)" }}>
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-white transition hover:opacity-95 active:scale-[0.98]"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {initialData ? "Update Draft" : "Create Draft"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePropertyForm;
