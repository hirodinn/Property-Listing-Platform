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
  }, [isError, isSuccess, message, dispatch, onSuccess]);

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
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

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1" htmlFor="images">
            {initialData ? "Add More Images (Optional)" : "Images * (Max 6)"}
          </label>
          <input
            type="file"
            id="images"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-(--color-secondary) file:text-white hover:file:bg-opacity-90"
            onChange={onFileChange}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required={!initialData} // Not required if editing (already has images)
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
