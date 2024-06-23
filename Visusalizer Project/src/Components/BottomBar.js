import { Link } from "react-router-dom";
import Github from "../Logo Pics/Github.png"
import LinkedIn from "../Logo Pics/LinkedIn.png"

const BottomBar = () => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Email address copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (  
        <nav className="navbar-bottom navbar">
            <div onClick={()=> copyToClipboard("jgross5@mail.yu.edu")}className="links contact-me">
                <Link>Contact Me</Link>
            </div>

            <a href = "https://github.com/tani-gross" target="_blank" rel="noopener noreferrer">
                <img className = "logo-image" src = {Github} alt = "Github Logo" />
            </a>
            <a href = "https://www.linkedin.com/in/tanigross/" target="_blank" rel="noopener noreferrer">
                <img className = "logo-image" src = {LinkedIn} alt = "LinkedIn Logo" />
            </a>
            
        </nav>
    );
}
 
export default BottomBar;