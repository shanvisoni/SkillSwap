import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { submitRating } from "../services/ratingService";

const RatingStar = ({ userId, itemId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  // Handle rating submission
  const handleSubmit = async (selectedRating) => {
    try {
      await submitRating(userId, itemId, selectedRating);
      setRating(selectedRating);
      if (onRatingSubmit) {
        onRatingSubmit(selectedRating);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`cursor-pointer transition-all duration-300 ${
            (hover || rating) >= star ? "text-yellow-400" : "text-gray-500"
          }`}
          size={24}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          onClick={() => handleSubmit(star)}
        />
      ))}
    </div>
  );
};

export default RatingStar;
