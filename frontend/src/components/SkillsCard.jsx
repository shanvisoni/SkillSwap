import PropTypes from "prop-types";

const SkillCard = ({ skill }) => {
  return (
    <div className="bg-gray-800 text-white rounded-2xl p-5 shadow-lg w-64">
      {/* Skill Name */}
      <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>

      {/* Skill Description */}
      <p className="text-gray-400 text-sm mb-4">{skill.description}</p>

      {/* Skill Level */}
      <p className="text-sm font-medium mb-2">Level: <span className="text-blue-400">{skill.level}</span></p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 h-2 rounded-full">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${skill.progress}%` }}
        ></div>
      </div>

      {/* Action Button */}
      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg">
        Learn More
      </button>
    </div>
  );
};

// Props Validation
SkillCard.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
  }).isRequired,
};

export default SkillCard;
