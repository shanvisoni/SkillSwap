

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../services/userService";
import { debounce } from "lodash";


const Home = () => {
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);


  //-changes for bulb brain icon -----------
  const [isBulb, setIsBulb] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBulb(prev => !prev);
    }, 5000); // Switch every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await userService.getRecentSkills();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const debouncedSearch = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await userService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  }, 300);

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <div className="w-full bg-gradient-to-r from-blue-700 to-purple-800 text-white py-16 text-center shadow-lg">
        <h1 className="text-4xl font-bold">Welcome to Community Skill Swap</h1>
        <p className="mt-2 text-lg">Find and exchange skills with like-minded people.</p>
        {/* <Link to="/search" className="mt-4 inline-block bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-cyan-400">
          Find Skills
        </Link> */}



<div className="mt-10 flex justify-center">
      {isBulb ? (
        // 💡 Bulb Icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-yellow-400 animate-bounce drop-shadow-[0_0_20px_rgba(250,204,21,0.9)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a7 7 0 00-7 7c0 2.25 1.25 4.25 3 5.5v1.5a1.5 1.5 0 001.5 1.5h5a1.5 1.5 0 001.5-1.5v-1.5c1.75-1.25 3-3.25 3-5.5a7 7 0 00-7-7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 21h6"
          />
        </svg>
      ) : (
        // 🧠 Brain Emoji
        <div className="text-6xl animate-bounce drop-shadow-[0_0_20px_rgba(192,132,252,0.9)] text-purple-400">
          🧠
        </div>
      )}
    </div> 



      </div>

      <div className="w-full max-w-3xl mt-8 px-4">
        <input
          type="text"
          placeholder="Search by Location, Profession, Teaching skills or Learning skills....."
          className="w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white focus:ring focus:ring-cyan-400"
          value={query}
          onChange={handleSearch}
        />
      </div>

      <div className="w-full max-w-4xl mt-10 px-4">
        <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div key={user._id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-lg font-bold">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.location}</p>
                <p className="text-sm font-semibold text-cyan-400">{user.skills.join(", ")}</p>
                <Link to={`/profile/${user._id}`} className="text-cyan-300 mt-2 inline-block hover:text-cyan-400">View Profile</Link>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No matching results found.</p>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl mt-10 px-4">
        <h2 className="text-2xl font-semibold mb-4">Recent Skill Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div key={skill.id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-lg font-bold">{skill.name}</h3>
                <p className="text-sm text-gray-400">{skill.description}</p>
                <Link to={`/profile/${skill.userId}`} className="text-cyan-300 mt-2 inline-block hover:text-cyan-400">View Profile</Link>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No skills available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
