// // src/components/ServiceStyleOne.js
// import React from 'react';
// import './OurServices.css';

// export default function ServiceStyleOne({ services }) {
//   return (
//     <div className="cards-container">
//       {services.map((service, index) => (
//         <div className="card" key={index}>
//           <img src={service.img} alt={service.title} className="service-icon" />
//           <h2>{service.title}</h2>
//           <p>
//             {service.description}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }


import React, { useState } from 'react';
import './OurServices.css';

export default function ServiceStyleOne({ services }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="services-wrapper">
      <div
        className={`cards-container ${hoveredIndex !== null ? 'blur-background' : ''}`}
      >
        {services.map((service, index) => (
          <div
            className={`card ${hoveredIndex === index ? 'expanded' : ''}`}
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img src={service.img} alt={service.title} className="service-icon" />
            <h2>{service.title}</h2>
            <p className={hoveredIndex === index ? 'expanded' : ''}>
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}