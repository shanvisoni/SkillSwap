

import { createContext, useContext, useState, useEffect } from "react";
import matchService from "../services/matchService";
import { useAuth } from "./AuthContext";

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState({ teaching: [], learning: [], mutual: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) fetchMatches();
  }, [user]);


  const fetchMatches = async () => {
    if (!user?._id) return;
  
    setLoading(true);
    try {
      // Ensure teaching and learning are arrays
      const userTeaching = Array.isArray(user.teaching) ? user.teaching : [];
      const userLearning = Array.isArray(user.learning) ? user.learning : [];
  
      const matchedData = await matchService.getMatchedSkills([...userTeaching, ...userLearning]);
      console.log("Fetched Matched Data:", matchedData); // Debug log
  
      if (!matchedData || typeof matchedData !== 'object') {
        setMatches({ teaching: [], learning: [], mutual: [] });
      } else {
        setMatches(matchedData);
      }
    } catch (err) {
      console.error("Error fetching matches:", err.response?.data || err.message);
      setError(err.response?.data || "Error fetching matches");
      setMatches({ teaching: [], learning: [], mutual: [] });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <MatchContext.Provider value={{ matches, loading, error, refreshMatches:fetchMatches }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatchContext = () => useContext(MatchContext);
