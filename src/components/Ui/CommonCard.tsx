import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";

interface CommonCardProps {
  image?: string;
  title: string;
  description?: string;
  price?: number;
  vegNonVeg?: string;
  tag?: string;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CommonCard: React.FC<CommonCardProps> = ({
  image,
  title,
  description,
  price,
  vegNonVeg,
  tag,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const defaultImage = "/images/default-food.jpg"; // ✅ Replace with actual path

  return (
    <div className="relative flex flex-col justify-between h-full bg-white rounded-xl shadow-md p-4">
      {/* Edit/Delete Buttons (Top Right) */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 bg-white rounded-full shadow hover:bg-blue-100 text-blue-600"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 bg-white rounded-full shadow hover:bg-red-100 text-red-600"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Image */}
      <img
        src={
          image && image.trim() !== ""
            ? image.startsWith("http")
              ? image
              : `/${image}`
            : defaultImage
        }
        alt={title}
        crossOrigin="anonymous"
        className="w-full h-40 object-cover rounded-md mb-4"
      />

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {tag && (
            <span className="text-xs bg-yellow-300 text-gray-800 px-2 py-1 rounded">
              {tag}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-500 mb-1">{description}</p>
        )}

        {price !== undefined && (
          <p className="text-sm font-semibold mb-1">Price: ₹{price}</p>
        )}

        {vegNonVeg && (
          <p
            className={`text-xs font-semibold ${
              vegNonVeg === "Veg"
                ? "text-green-600"
                : vegNonVeg === "Non-Veg"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {vegNonVeg}
          </p>
        )}
      </div>

      {/* View Details Button */}
      {onViewDetails && (
        <div className="mt-4">
          <button
            onClick={onViewDetails}
            className="w-full bg-[#8E3CF7] text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default CommonCard;
