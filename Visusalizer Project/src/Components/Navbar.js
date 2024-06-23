import { Link } from "react-router-dom";

const NavBar = () => {
    return (  
        <nav className="navbar-top navbar">
            <h1>Data Structure and Algorithm Visualizer</h1>
            <div className="links">
                <Link to="/graphs">Graphs</Link>
                <Link to="/sorting">Sorting</Link>
                <Link to="/">Home</Link>
            </div>
        </nav>
    );
}
 
export default NavBar;