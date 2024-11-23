import Logo from '../assets/images/Logo.avif';
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="header py-3">
      <nav className="flex gap-7 text-lg font-semibold">
        <NavLink to="/" className="items-center justify-center flex transition-transform hover:scale-105">
          <img src={Logo} alt="Cat and Cloud Logo" className="h-12" />
        </NavLink>

        <NavLink 
          to="/ourcoffees" 
          className={({ isActive }) => 
            `transition-all duration-200 relative ${
              isActive 
                ? 'text-blue-500 after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-blue-500 after:bottom-0 after:left-0' 
                : 'text-gray-700 hover:text-blue-500 hover:after:content-[""] hover:after:absolute hover:after:w-full hover:after:h-0.5 hover:after:bg-blue-500 hover:after:bottom-0 hover:after:left-0 hover:after:scale-x-100 after:scale-x-0 after:transition-transform after:duration-200'
            }`
          }
        >
          Our Coffees
        </NavLink>

        <NavLink 
          to="/coffeeclass" 
          className={({ isActive }) => 
            `transition-all duration-200 relative ${
              isActive 
                ? 'text-blue-500 after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-blue-500 after:bottom-0 after:left-0' 
                : 'text-gray-700 hover:text-blue-500 hover:after:content-[""] hover:after:absolute hover:after:w-full hover:after:h-0.5 hover:after:bg-blue-500 hover:after:bottom-0 hover:after:left-0 hover:after:scale-x-100 after:scale-x-0 after:transition-transform after:duration-200'
            }`
          }
        >
          Coffee Classes
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar;
