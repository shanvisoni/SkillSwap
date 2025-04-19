import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { MatchContext } from "../context/MatchContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { matches, loading, error } = useContext(MatchContext);
  const [ratingInfo, setRatingInfo] = useState({ avgRating: 0, total: 0 });

  useEffect(() => {
    const fetchMyRating = async () => {
      if (!user?._id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ratings/average/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setRatingInfo(data);
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    };

    fetchMyRating();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col items-center">


<h1 className="text-4xl font-bold text-center">
  <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
    Welcome, 
  </span>
  <span className="bg-gradient-to-r from-pink-400 to-rose-500 text-transparent bg-clip-text">
    {user?.name}!
  </span>
</h1>

<div className="relative inline-block">

  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 opacity-75 
                  animate-[pulse_3s_ease-in-out_infinite] blur-sm"></div>
</div>


      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* Matched Users Section */}
        <div className="md:col-span-2 bg-[#1E1E1E] p-6 rounded-lg shadow-xl border border-[#00ADB5]">
          <h2 className="text-2xl font-semibold text-[#00FFF5]">
            Matched Users
          </h2>

          {loading ? (
            <p className="text-gray-400 mt-4">Loading matches...</p>
          ) : error ? (
            <p className="text-red-500 mt-4">{error}</p>
          ) : (matches?.learningFromMe?.length || 0) > 0 || (matches?.teachingMe?.length || 0) > 0 ? (
            <div className="mt-4 space-y-4">
              {matches?.learningFromMe?.length > 0 && (
                <div>
                  <h3 className="font-medium text-[#00ADB5] text-lg">
                    People Learning From Me:
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {matches.learningFromMe.map((match) => (
                      <li
                        key={match._id}
                        className="p-3 bg-[#2A2A2A] rounded-lg flex justify-between items-center"
                      >
                        <span className="text-gray-300">
                          {match.name} is learning{" "}
                          <span className="text-[#00FFF5]">
                            {(match.matchedLearning || []).join(", ")}
                          </span>
                        </span>
                        <Link
                          to={`/profile/${match._id}`}
                          className="text-[#00FFF5] font-semibold hover:underline"
                        >
                          Visit
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {matches?.teachingMe?.length > 0 && (
                <div>
                  <h3 className="font-medium text-[#00ADB5] text-lg mt-4">
                    People Teaching Me:
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {matches.teachingMe.map((match) => (
                      <li
                        key={match._id}
                        className="p-3 bg-[#2A2A2A] rounded-lg flex justify-between items-center"
                      >
                        <span className="text-gray-300">
                          {match.name} is teaching{" "}
                          <span className="text-[#00FFF5]">
                            {(match.matchedTeaching || []).join(", ")}
                          </span>
                        </span>
                        <Link
                          to={`/profile/${match._id}`}
                          className="text-[#00FFF5] font-semibold hover:underline"
                        >
                          Visit
                        </Link>
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

        {/* Profile Section with Dynamic Rating */}
        <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl border border-[#00ADB5] flex flex-col items-center">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-teal-500 text-transparent bg-clip-text">
  👤 My Profile
</h2>

          {/* <Link
            to="/profile"
            className="mt-6 px-6 py-3 bg-[#00ADB5] text-[#222831] font-semibold rounded-lg hover:bg-[#00FFF5] transition duration-300 shadow-lg"
          >
            View My Profile
          </Link> */}

          <div className="mt-10 flex flex-col items-center">
            <div className="relative w-16 h-16 flex justify-center items-center">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-ping" />
              <div className="text-6xl text-yellow-400 drop-shadow-lg animate-bounce z-10">
                ⭐
              </div>
            </div>

            {/* Dynamic Rating Value */}
            {ratingInfo.total > 0 ? (
              <>
                <div className="mt-4 text-xl font-bold text-[#00FFF5] bg-[#2A2A2A] px-4 py-2 rounded-full shadow-lg border border-[#00ADB5]">
                  {ratingInfo.avgRating} / 5 Rating
                </div>
                <p className="text-sm text-gray-400 mt-1 italic mb-10">
                  Based on {ratingInfo.total} user rating
                  {ratingInfo.total > 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <div className="mt-4 text-gray-400 italic mb-10">
                No ratings yet.
              </div>
            )}
              <Link
    to="/profile"
    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-full hover:from-teal-400 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 gap-2"
  >
    <span>👤</span> View My Profile
  </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
