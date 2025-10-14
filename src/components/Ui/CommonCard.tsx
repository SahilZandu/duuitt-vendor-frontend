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
    <div className="flex flex-row justify-around">
      <div className="flex-1">
      <div className="mt-4"> 
      {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full bg-[#8E3CF7] text-white py-[10px] text-sm px-4 rounded hover:bg-purple-700 transition"
          >
            View Details
          </button>
      )}
      </div>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex flex-1 items-center justify-evenly">
          <div className="mt-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="w-full text-white bg-[#3182CE] py-[11px] px-4 transition rounded hover:bg-[#2B6CB0]"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4 text-lg" />
            </button>
          )}
          </div>
          
          <div className="mt-4">
          {onDelete && (
            <button
              onClick={onDelete}
              className=" text-white bg-[#E53E3E] py-[11px] rounded px-4 transition hover:bg-[#C53030]"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
          </div>

        </div>
      )}
    </div>
    </div>
  );
};

export default CommonCard;
