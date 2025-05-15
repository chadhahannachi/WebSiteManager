// src/components/SolutionStyleThree.js
import React, { useState } from 'react';
import './OurSolutions.css';

const DESCRIPTION_LIMIT = 50;

export default function SolutionStyleThree({ solutions }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="solutions-container style-three">
      {solutions.map((solution, index) => {
        const isDescriptionLong = solution.description.length > DESCRIPTION_LIMIT;
        const truncatedDescription =
          isDescriptionLong && hoveredIndex !== index
            ? `${solution.description.substring(0, DESCRIPTION_LIMIT)}...`
            : solution.description;

        return (
          <div
            className="solution-card"
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img src={solution.img} alt={solution.title} className="solution-image" />
            <div className="solution-content">
              <h3>{solution.title}</h3>
              <p>
                {truncatedDescription}{' '}
                {isDescriptionLong && hoveredIndex !== index && (
                  <span className="read-more">Read more</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}