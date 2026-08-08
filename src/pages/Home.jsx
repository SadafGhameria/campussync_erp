import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Trusted from "../components/Trusted/Trusted";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import Modules from "../components/Modules/Modules";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Trusted />
      <WhyChoose />
      <Modules />
      <About />
      <Contact />
    </>
  );
}

export default Home;