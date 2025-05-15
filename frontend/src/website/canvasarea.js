import React from 'react';
import Navbar from './navbar/Navbar';
import Slider from './slider/Slider';
import OurPartners from './partners/OurPartners';
import LatestEvents from './events/LatestEvents';
import AboutUs from './aboutus/AboutUs';
import ContactUs from './contactus/ContactUs';
import OurSolutions from './solutions/OurSolutions';
import News from './news/News';
import Testimonials from './testimonials/Testimonials';
import Footer from './footer/Footer';
import FaqSection from './faqs/FaqSection';
import Units from './units/Units';
import OurServices from './services/OurServices';

const CanvasArea = ({ styles }) => {
  return (
    <div>
      <Navbar />
      <div id="home"><Slider styleIndex={styles.sliderStyle} /></div>
      <div id="partners"><OurPartners styleIndex={styles.partnersStyle} /></div>
      <div id="about"><AboutUs styleIndex={styles.aboutStyle} /></div>
      <div id="units"><Units styleIndex={styles.unitsStyle} /></div>
      <div id="services"><OurServices styleIndex={styles.servicesStyle} /></div>
      <div id="solutions"><OurSolutions styleIndex={styles.solutionsStyle} /></div>
      <div id="events"><LatestEvents styleIndex={styles.eventsStyle} /></div>
      <div id="news"><News styleIndex={styles.newsStyle} /></div>
      <div id="testimonials"><Testimonials /></div>
      <div id="faq"><FaqSection styleIndex={styles.faqStyle} /></div>
      <div id="contact"><ContactUs styleIndex={styles.contactStyle} /></div>
      <Footer />
    </div>
  );
};

export default CanvasArea;
