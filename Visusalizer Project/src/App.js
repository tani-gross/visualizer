import NavBar from './Components/Navbar';
import Home from './Components/Home';
import Sorting from './Components/Sorting';
import Graphs from './Components/Graphs';
import BottomBar from './Components/BottomBar';
import { GraphProvider } from './Components/Helper Functions/GraphContext';

import {BrowserRouter , Route, Routes} from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path = "/" element={<Home />} />
            <Route path = "/sorting" element={<Sorting />} />
            <Route 
              path = "/graphs" 
              element={
                <GraphProvider>
                  <Graphs />
                </GraphProvider>
              } />
          </Routes>
        </div>
        <BottomBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
