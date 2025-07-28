import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-3xl font-extrabold leading-none">
          {/* <img src={Logo} alt="Duuit Logo" className="w-70 h-70" /> */}
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              DUU
            </span>
            <span className="text-white">ITT</span>
          </div>
        </Link>

        {/* Optional Right Side (Menu, Login, etc.) */}
        {/* <nav className="hidden md:flex space-x-6 text-white font-medium">
          <Link to="/login" className="hover:text-purple-300">Login</Link>
        </nav> */}
      </div>
    </header>
  );
};

export default Navbar;
