import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleLinkClick = (path) => {
        setActiveLink(path);
    }

    return (  
        <nav className="navbar-top navbar">
            <h1>Data Structure and Algorithm Visualizer</h1>
            <div className="links">
                <Link 
                    to="/graphs"
                    className={activeLink==='/graphs' ? 'active' : ''}
                    onClick={() => handleLinkClick('/graphs')}>Graphs</Link>
                <Link 
                    to="/sorting"
                    className={activeLink==='/sorting' ? 'active' : ''}
                    onClick={() => handleLinkClick('/sorting')}>Sorting</Link>
                <Link 
                    to="/"
                    className={activeLink==='/' ? 'active' : ''}
                    onClick={() => handleLinkClick('/')}>Home</Link>
            </div>
        </nav>
    );
}
 
export default NavBar;