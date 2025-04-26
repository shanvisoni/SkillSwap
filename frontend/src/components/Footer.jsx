import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto text-center">
        {/* Navigation Links */}
        <ul className="flex justify-center space-x-6 mb-4">
          <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
          <li><Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
          <li><Link to="/profile" className="hover:text-blue-400">Profile</Link></li>
          <li><Link to="/chats" className="hover:text-blue-400">Chat</Link></li>
          {/* <li><Link to="/progress" className="hover:text-blue-400">Progress</Link></li> */}
        </ul>

        {/* Copyright Text */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} SkillSwap All rights reserved.
        </p>

        {/* Social Media Links (Optional) */}
        <div className="flex justify-center space-x-4 mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook text-xl hover:text-blue-500"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter text-xl hover:text-blue-400"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin text-xl hover:text-blue-600"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
