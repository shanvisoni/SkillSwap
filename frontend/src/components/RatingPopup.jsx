

import { useState } from 'react';
import { rateUser } from '../services/ratingService';
import { motion, AnimatePresence } from 'framer-motion';

const popupVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: 'easeInOut' } },
};

const starVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2, transition: { duration: 0.2, ease: 'easeInOut' } },
};

const submitButtonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: 'easeInOut' } },
};

const RatingPopup = ({ onClose, fromUser, toUser }) => {
  const [selectedRating, setSelectedRating] = useState(0);

  const handleSubmit = async () => {
    await rateUser(fromUser, toUser, selectedRating);
    onClose(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-5 right-5 z-50"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={popupVariants}
      >
        <motion.div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-72 p-4 relative">
          {/* Close button */}
          <motion.button
            onClick={() => onClose(false)}
            className="absolute top-2 right-2 text-purple-400 hover:text-purple-600 text-lg font-bold focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </motion.button>

          {/* Heading */}
          <motion.h3 className="text-lg font-semibold text-cyan-400 text-center mb-3">Rate this user</motion.h3>

          {/* Stars */}
          <motion.div className="flex justify-center mb-4 text-xl">
            {[1, 2, 3, 4, 5].map((num) => (
              <motion.span
                key={num}
                onClick={() => setSelectedRating(num)}
                className={`cursor-pointer transition-colors ${
                  selectedRating >= num ? 'text-yellow-500 shadow-md' : 'text-gray-600 hover:text-yellow-500'
                }`}
                variants={starVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                style={{ textShadow: selectedRating >= num ? '0 0 6px rgba(255, 255, 0, 0.7)' : 'none' }}
              >
                ★
              </motion.span>
            ))}
          </motion.div>

          {/* Submit button */}
          <motion.button
            onClick={handleSubmit}
            disabled={selectedRating === 0}
            className={`w-full py-2 px-4 rounded-md font-semibold transition focus:outline-none ${
              selectedRating === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700 shadow-md'
            }`}
            variants={submitButtonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RatingPopup;







// import { useState } from 'react';
// import { rateUser } from '../services/ratingService';

// const RatingPopup = ({ onClose, fromUser, toUser }) => {
//   const [selectedRating, setSelectedRating] = useState(0);

//   const handleSubmit = async () => {
//     await rateUser(fromUser, toUser, selectedRating);
//     onClose(true);
//   };

//   return (
//     <div className="fixed top-5 right-5 z-50">
//       <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-72 p-4 relative animate-fade-in">
//         {/* Close button */}
//         <button
//           onClick={() => onClose(false)}
//           className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-lg font-bold"
//         >
//           ✕
//         </button>

//         {/* Heading */}
//         <h3 className="text-lg font-semibold text-white text-center mb-3">Rate this user</h3>

//         {/* Stars */}
//         <div className="flex justify-center mb-4 text-xl">
//           {[1, 2, 3, 4, 5].map((num) => (
//             <span
//               key={num}
//               onClick={() => setSelectedRating(num)}
//               className={`cursor-pointer transition-colors ${
//                 selectedRating >= num ? 'text-yellow-500' : 'text-gray-600'
//               }`}
//             >
//               ★
//             </span>
//           ))}
//         </div>

//         {/* Submit button */}
//         <button
//           onClick={handleSubmit}
//           disabled={selectedRating === 0}
//           className={`w-full py-2 px-4 rounded-md font-semibold transition ${
//             selectedRating === 0
//               ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
//               : 'bg-indigo-600 text-white hover:bg-indigo-700'
//           }`}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RatingPopup;