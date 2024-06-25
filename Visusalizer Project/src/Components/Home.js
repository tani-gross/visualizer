import {useEffect} from 'react'; 
import GraphScreenshot from "../Pictures/home-graph.png"
import SortingScreenshot from "../Pictures/home-sorting.png"

const Home = () => {
    useEffect(() => {
        
    });

    return (  
        <div className="home-container">
        <section className="home-section">
            <h1 style={{color: "#f1356d"}} className="home-section-title">Welcome to the Data Structure and Algorithm Visualizer</h1>
            <p>Explore various graph algorithms and sorting techniques through interactive visualizations. This tool provides a hands-on approach to learning algorithms, helping you to understand how they work step-by-step.</p>
        </section>

        <section className="home-section">
            <h2 className="home-section-title">Features</h2>
            <ul className="home-section-list">
                <li><strong>Sorting Algorithms:</strong> Visualize selection sort, insertion sort, bubble sort, merge sort, quicksort, heap sort, and shell sort.</li>
                <li><strong>Graph Algorithms:</strong> Explore traversal algorithms (DFS), MST algorithms (Prim), path algorithms (TSP), and more</li>
                <li><strong>Interactive Controls:</strong> Adjust the speed, number of elements, and pause/resume/step through the animations for better understanding.</li>
                <li><strong>Customizable Graphs:</strong> Add, remove, and connect nodes to create your own graphs.</li>
            </ul>
        </section>

        <section className="home-section">
            <h2 className="home-section-title">How to Use</h2>
            <ol className="home-section-list">
                <li>Navigate to the Sorting or Graphs section using the top menu.</li>
                <li>Adjust the number of elements or nodes and the speed of the animation using the provided sliders.</li>
                <li>Select a sorting algorithm or graph algorithm from the list.</li>
                <li>Click to begin the visualization. For graph algorithms you can pause, resume, or step through the algorithm using the control buttons.</li>
                <li>Observe the algorithm in action and learn how it processes the data.</li>
            </ol>
        </section>

        <h2 className="home-section-title">Screenshots</h2>
        <section className="screenshots">
            <div class="screenshot">
                <img src={GraphScreenshot} alt="Sorting Algorithm Visualization" />
            </div>
            <div class="screenshot">
                <img src={SortingScreenshot} alt="Graph Algorithm Visualization" />
            </div>
        </section>

        

        <section>
            <h2 className="home-section-title">Contact Me</h2>
            <p>If you have any questions, feedback, or suggestions, feel free to reach out to me using the links at the bottom of the page</p>
        </section>
    </div>
    );
}
 
export default Home;