import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ActivityNavbar from './ActNavbar';
import IntroductionPage from './Home';

import MapWithScreenshot from './Map';

function PreloginRoute() {
    return (
        <div className="App">
            <Router>
                <ActivityNavbar/>
                <Routes>
                    <Route path='/' element={<IntroductionPage/>}/>
                    <Route path='/map'element={<MapWithScreenshot/>} />
                </Routes>
            </Router>

        </div>
    );
}

export default PreloginRoute;
