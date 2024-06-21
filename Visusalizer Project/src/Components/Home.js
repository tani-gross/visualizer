import {useEffect} from 'react'; 

const Home = () => {
    //const [name, setName] = useState("Tani");
    //<BlogList blogs={blogs.filter((blog) => blog.author==="tani")} title="Tani's blogs"/>

    /*const [blogs, setBlogs] = useState([
        {title: "My new website", body: 'blah blah blah', author: "tani", id: 1},
        {title: "Welcome Party", body: 'blah blah blah', author: "tani", id: 2},
        {title: "Web deb top tios", body: 'blah blah blah', author: "jake", id: 3},
    ]);
    
    const handleDelete = (id) => {
        const newBlogs = blogs.filter((blog) => blog.id !== id)
        setBlogs(newBlogs);
    }*/

    //runs at first render and whenever the state changes
    //possible to have it ran just at the first render and not on any changes
    //possible to have it run just when a specific state changes
    useEffect(() => {
        
    });

    return (  
        <div className = "home">
            
        </div>
    );
}
 
export default Home;