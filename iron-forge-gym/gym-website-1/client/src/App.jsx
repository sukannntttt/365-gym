import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import DietPlans from './components/DietPlans';
import WorkoutPlans from './components/WorkoutPlans';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/diet-plans" component={DietPlans} />
                <Route path="/workout-plans" component={WorkoutPlans} />
            </Switch>
        </Router>
    );
};

export default App;