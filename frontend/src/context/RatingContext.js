import { createContext, useContext, useEffect, useState } from "react";
import { fetchRatings, submitRating } from "../services/ratingService";

// Create rating context
const RatingContext = createContext();

// Provider Component
export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ratings when the component mounts
  useEffect(() => {
    const loadRatings = async () => {
      try {
        const data = await fetchRatings();
        setRatings(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load ratings");
      } finally {
        setLoading(false);
      }
    };
    loadRatings();
  }, []);

  // Function to submit a new rating
  const handleSubmitRating = async (ratingData) => {
    try {
      const newRating = await submitRating(ratingData);
      setRatings((prevRatings) => [newRating, ...prevRatings]); // Add new rating to state
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <RatingContext.Provider value={{ ratings, loading, error, handleSubmitRating }}>
      {children}
    </RatingContext.Provider>
  );
};

// Custom hook for using RatingContext
export const useRating = () => useContext(RatingContext);
