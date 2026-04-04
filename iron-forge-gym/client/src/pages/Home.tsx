import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import MembershipCards from '../components/MembershipCards';
import TrainersSection from '../components/TrainersSection';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
    return (
        <div>
            <HeroSection />
            <MembershipCards />
            <TrainersSection />
            <Testimonials />
            <ContactSection />
        </div>
    );
};

export default Home;