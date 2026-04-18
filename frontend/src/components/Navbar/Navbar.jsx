
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.wholenavbar}> 
        <div className={styles.navbar}>
            <div className={styles.navbarlinks}>
                <NavLink to='/'>Add Task</NavLink>
                <NavLink to='/today'>Today</NavLink>
                <NavLink to='/calendar'>Calendar</NavLink>
                <NavLink to='/stats'>Stats</NavLink>
                <NavLink to='/progress'>Progress</NavLink>
                <NavLink to='/contact'>Contact</NavLink>
            </div>
        </div>
        </nav>
  )
}