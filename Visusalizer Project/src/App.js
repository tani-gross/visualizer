import NavBar from './Components/Navbar';
import Home from './Components/Home';
import Sorting from './Components/Sorting';
import Graphs from './Components/Graphs';

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
            <Route path = "/graphs" element={<Graphs />} />
            
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
