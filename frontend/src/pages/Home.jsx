

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../services/userService";
import { debounce } from "lodash";

const Home = () => {
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
      </div>

      <div className="w-full max-w-3xl mt-8 px-4">
        <input
          type="text"
          placeholder="Search by location, skills, teaching or learning..."
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
