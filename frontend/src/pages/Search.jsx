import { useState, useEffect } from "react";
// import { searchService } from "../services/searchService";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim() !== "") {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search?skill=${query}`);
        const data = await response.json();
        setResults(data);
        
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Search for Skill Partners</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by skill..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border rounded-lg text-lg"
      />

      {/* Loading State */}
      {loading && <p className="text-center text-gray-500 mt-4">Searching...</p>}

      {/* Search Results */}
      <div className="mt-4">
        {results.length > 0 ? (
          results.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border-b"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-500">Skills: {user.skills.join(", ")}</p>
              </div>
              <a
                href={`mailto:${user.email}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Contact
              </a>
            </div>
          ))
        ) : (
          !loading && query && (
            <p className="text-center text-gray-500 mt-4">No results found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
