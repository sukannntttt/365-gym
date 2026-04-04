import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Membership from './pages/Membership';
import BMICalculator from './pages/BMICalculator';
import TrainingPlans from './pages/TrainingPlans';
import DietGenerator from './pages/DietGenerator';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/membership" component={Membership} />
        <Route path="/bmi-calculator" component={BMICalculator} />
        <Route path="/training-plans" component={TrainingPlans} />
        <Route path="/diet-generator" component={DietGenerator} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/admin" component={Admin} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;