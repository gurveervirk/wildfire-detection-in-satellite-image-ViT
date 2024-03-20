import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ActivityNavbar from './ActNavbar';
import IntroductionPage from './Home';
import Form from './ActForm';
import ActivityDetails from './ActList';

function PreloginRoute() {
    return (
        <div className="App">
            <Router>
                <ActivityNavbar/>
                <Routes>
                    <Route path='/' element={<IntroductionPage/>}/>
                    <Route path='/activity' element={<ActivityDetails/>} />
                    <Route path='/new'element={<Form/>} />
                </Routes>
            </Router>

        </div>
    );
}

export default PreloginRoute;
