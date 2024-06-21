import { Link } from "react-router-dom";

const NavBar = () => {
    return (  
        <nav className="navbar">
            <h1>Tani Gross's Website</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/graphs">Graphs</Link>
                <Link to="/sorting">Sorting</Link>
            </div>
        </nav>
    );
}
 
export default NavBar;