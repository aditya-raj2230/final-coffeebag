import Logo from '../assets/images/Logo.avif';
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="header py-3">
      <nav className="flex gap-7 text-lg font-semibold">
        <NavLink to="/" className="items-center justify-center flex">
          <img src={Logo} alt="Cat and Cloud Logo" className="h-12" />
        </NavLink>

        <NavLink to="/ourcoffees" className={({ isActive }) => isActive ? 'text-blue-500 underline' : 'text-gray-700 hover:text-blue-500'}>
          Our Coffees
        </NavLink>

        <NavLink to="/coffeeclass" className={({ isActive }) => isActive ? 'text-blue-500 underline' : 'text-gray-700 hover:text-blue-500'}>
          Coffee Classes
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar;
