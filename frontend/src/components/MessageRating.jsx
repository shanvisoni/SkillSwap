// components/MessageRating.jsx
import { useState, useEffect } from "react";
import { submitRating, getRating } from "../services/ratingService";
import { FaStar } from "react-icons/fa";

const MessageRating = ({ messageId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const fetchInitialRating = async () => {
      const res = await getRating(messageId);
      if (res?.rating) setRating(res.rating);
    };
    fetchInitialRating();
  }, [messageId]);

  const handleRating = async (rate) => {
    try {
      setRating(rate);
      await submitRating(messageId, rate);
    } catch (err) {
      console.error("Rating failed:", err.message);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={20}
          className="cursor-pointer transition-colors"
          color={(hover || rating) >= star ? "#ffc107" : "#e4e5e9"}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
        />
      ))}
    </div>
  );
};

export default MessageRating;
