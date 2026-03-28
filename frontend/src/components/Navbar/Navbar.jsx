
import { NavLink } from 'react-router-dom'
 
export default function Navbar() {
  return (
    <nav>
      <span>TechAgency</span>
 
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
 
        <li>
          <NavLink to="/services">Usługi</NavLink>
        </li>
 
        <li>
          <NavLink to="/team">Zespół</NavLink>
        </li>
 
        <li>
          <NavLink to="/news">Aktualności</NavLink>
        </li>
 
        <li>
          <NavLink to="/contact">Kontakt</NavLink>
        </li>
      </ul>
    </nav>
  )
}