import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import userService from "../services/userService";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [newTeaching, setNewTeaching] = useState("");
  const [newLearning, setNewLearning] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        const userData = await userService.getUserById(user._id);
        setProfile(userData);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleArrayAdd = (field, valueSetter, newValue) => {
    if (newValue.trim() !== "" && !profile[field].includes(newValue)) {
      setProfile((prev) => ({
        ...prev,
        [field]: [...prev[field], newValue],
      }));
      valueSetter("");
    }
  };

  const handleArrayRemove = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

 
  const handleSave = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired. Please log in again.");
        return;
      }
  
      const payload = {
        name: profile.name,
        bio: profile.bio,
        skills: profile.skills,
        teaching: profile.teaching,
        learning: profile.learning,
        availability: profile.availability,
        location: profile.location,
      };
  
      console.log("Sending data:", payload);
  
      const response = await userService.updateUserProfile(payload, token);
      
      console.log("Response from API:", response);
      
      if (!response || response.error) {
        throw new Error(response.message || "Unknown error");
      }
  
      const updatedUser = await userService.getUserById(user._id);
      
      console.log("Updated user:", updatedUser);
  
      if (typeof updateUser === "function") {
        updateUser(updatedUser);
      } else {
        console.error("updateUser is not a function");
      }
  
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Error updating profile. Please try again.");
    }
  };
  
  

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">Profile</h2>

        {/* Name & Email */}
        <div className="mb-4">
          <label className="block text-gray-400 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded mt-1 cursor-not-allowed text-gray-500"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-400 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Availability */}
        <div className="mb-4">
          <label className="block text-gray-400 font-medium">Availability</label>
          <select
            name="availability"
            value={profile.availability}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Flexible">Flexible</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
          </select>
        </div>

        {/* Profession, Teaching, Learning */}
        {["skills", "teaching", "learning"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-400 font-medium">
              {field === "skills" ? "Profession" : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile[field].map((item, idx) => (
                <span
                  key={idx}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {item}
                  {isEditing && (
                    <button
                      onClick={() => handleArrayRemove(field, item)}
                      className="ml-2 text-red-300 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="mt-3 flex">
                <input
                  type="text"
                  value={
                    field === "skills" ? newSkill : field === "teaching" ? newTeaching : newLearning
                  }
                  onChange={(e) =>
                    field === "skills"
                      ? setNewSkill(e.target.value)
                      : field === "teaching"
                      ? setNewTeaching(e.target.value)
                      : setNewLearning(e.target.value)
                  }
                  className="border border-gray-600 p-2 rounded w-full bg-gray-800 text-white"
                  placeholder={`Add a ${field}...`}
                />
                <button
                  onClick={() =>
                    handleArrayAdd(
                      field,
                      field === "skills" ? setNewSkill : field === "teaching" ? setNewTeaching : setNewLearning,
                      field === "skills" ? newSkill : field === "teaching" ? newTeaching : newLearning
                    )
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-600 transition"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


