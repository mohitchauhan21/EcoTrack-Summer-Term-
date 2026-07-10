import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Landing;
