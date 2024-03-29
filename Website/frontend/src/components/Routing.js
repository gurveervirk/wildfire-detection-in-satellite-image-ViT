import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ActivityNavbar from './Navbar';
import IntroductionPage from './Home';
import ImagePage from './Image'
import MapWithScreenshot from './Map';
import Region from './Region';

function PreloginRoute() {
    return (
        <div className="App">
            <Router>
                <ActivityNavbar/>
                <Routes>
                    <Route path='/' element={<IntroductionPage/>}/>
                    <Route path='/image' element={<ImagePage/>}/>
                    <Route path='/map'element={<MapWithScreenshot/>} />
                    <Route path='/region'element={<Region/>}/>
                </Routes>
            </Router>

        </div>
    );
}

export default PreloginRoute;
