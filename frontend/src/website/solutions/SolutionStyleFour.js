// import React from 'react';
// import './OurSolutions.css';

// export default function SolutionStyleFour({ solutions }) {
//   return (
//     <div className="solutions-container style-four">
//       {solutions.map((solution, index) => (
//         <div className="solution-card" key={index}>
//           <img src={solution.img} alt={solution.title} className="solution-image" />
//           <div className="solution-content">
//             <h3>{solution.title}</h3>
//             <p>{solution.description}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import React from 'react';
import './OurSolutions.css';

export default function SolutionStyleFour({ solutions }) {
  return (
    <div className="solutions-container style-four">
      {solutions.map((solution, index) => (
        <div className="solution-card" key={index}>
          <div className="solution-thumb">
            <img src={solution.img} alt={solution.title} className="solution-image" />
            <div className="solution-overlay">
              <div className="solution-content">
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}