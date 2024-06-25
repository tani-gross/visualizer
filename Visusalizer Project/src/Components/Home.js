import {useEffect} from 'react'; 

const Home = () => {
    useEffect(() => {
        
    });

    return (  
        <div class="home-container">
        <section class="introduction home-section">
            <h2 class="home-section-title">Introduction</h2>
            <p>Data Strucures and Algorithm Visualizer to help understand...</p>
        </section>
        
        <section class="features home-section">
            <h2 class="home-section-title">Features</h2>
            <ul>
                <li class="home-list-item">Custom graph creation and editing</li>
                <li class="home-list-item">step-by-step walk through of different complex algorithms</li>
                <li class="home-list-item">differnet sorting algs</li>
            </ul>
        </section>
        <section class="usage home-section">
            <h2 class="home-section-title">Usage</h2>
            <p>Explain how the button works and how the text explains what to do and what's happening</p>
        </section>
        <section class="technologies home-section">
            <h2 class="home-section-title">Technologies Used</h2>
            <ul>
                <li class="home-list-item">ReactJS</li>
                <li class="home-list-item">HTML</li>
                <li class="home-list-item">CSS</li>
            </ul>
        </section>
        <section class="contributors home-section">
            <h2 class="home-section-title">Note:</h2>
            <p>This is just a temporary page</p>
        </section>
    </div>
    );
}
 
export default Home;