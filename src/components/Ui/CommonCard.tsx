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
    <div className="relative flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
      {/* Image */}
      <div className="relative">
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
          className="w-full h-48 object-cover"
        />
        {vegNonVeg && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded ${
              vegNonVeg === "Veg"
                ? "bg-green-100 text-green-700"
                : vegNonVeg === "Non-Veg"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {vegNonVeg}
          </span>
        )}
        {tag && (
          <span className="absolute top-3 right-3 text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded font-medium">
            {tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{title}</h3>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[40px]">
          {description || "No description"}
        </p>

        <p className="text-xl font-bold text-[#8E3CF7] mb-4">
          ₹{price ?? 0}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 bg-[#8E3CF7] text-white py-2 text-sm px-4 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              View Details
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-white bg-[#3182CE] p-2 rounded-lg transition hover:bg-[#2B6CB0]"
              title="Edit"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-white bg-[#E53E3E] p-2 rounded-lg transition hover:bg-[#C53030]"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonCard;
