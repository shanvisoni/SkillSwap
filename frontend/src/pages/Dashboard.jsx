import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { MatchContext } from "../context/MatchContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { matches, loading, error } = useContext(MatchContext);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col items-center">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-center text-[#00FFF5] drop-shadow-lg">Welcome, {user?.name}!</h1>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* Matched Users Section */}
        <div className="md:col-span-2 bg-[#1E1E1E] p-6 rounded-lg shadow-xl border border-[#00ADB5]">
          <h2 className="text-2xl font-semibold text-[#00FFF5]">Matched Users</h2>
          
          {loading ? (
            <p className="text-gray-400 mt-4">Loading matches...</p>
          ) : error ? (
            <p className="text-red-500 mt-4">{error}</p>
          ) : (matches?.learningFromMe?.length || 0) > 0 || (matches?.teachingMe?.length || 0) > 0 ? (
            <div className="mt-4 space-y-4">
              {/* Users Learning from Me */}
              {matches?.learningFromMe?.length > 0 && (
                <div>
                  <h3 className="font-medium text-[#00ADB5] text-lg">People Learning From Me:</h3>
                  <ul className="mt-2 space-y-2">
                    {matches.learningFromMe.map((match) => (
                      <li key={match._id} className="p-3 bg-[#2A2A2A] rounded-lg flex justify-between items-center">
                        <span className="text-gray-300">{match.name} is learning <span className="text-[#00FFF5]">{(match.matchedLearning || []).join(", ")}</span></span>
                        <Link to={`/profile/${match._id}`} className="text-[#00FFF5] font-semibold hover:underline">Visit</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Users Teaching Me */}
              {matches?.teachingMe?.length > 0 && (
                <div>
                  <h3 className="font-medium text-[#00ADB5] text-lg mt-4">People Teaching Me:</h3>
                  <ul className="mt-2 space-y-2">
                    {matches.teachingMe.map((match) => (
                      <li key={match._id} className="p-3 bg-[#2A2A2A] rounded-lg flex justify-between items-center">
                        <span className="text-gray-300">{match.name} is teaching <span className="text-[#00FFF5]">{(match.matchedTeaching || []).join(", ")}</span></span>
                        <Link to={`/profile/${match._id}`} className="text-[#00FFF5] font-semibold hover:underline">Visit</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 mt-4">No matched users yet.</p>
          )}
        </div>

        {/* Profile Section */}
        <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl border border-[#00ADB5] flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-[#00FFF5]">My Profile</h2>
          <Link 
            to="/profile" 
            className="mt-6 px-6 py-3 bg-[#00ADB5] text-[#222831] font-semibold rounded-lg hover:bg-[#00FFF5] transition duration-300 shadow-lg"
          >
            View My Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;