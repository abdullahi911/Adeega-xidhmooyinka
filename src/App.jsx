import './index.css';
import './App.css';
import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import Packages      from './components/Packages';
import ContactSection from './components/ContactSection';
import Footer        from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Packages />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
