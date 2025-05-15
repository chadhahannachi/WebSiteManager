// src/components/SolutionStyleOne.js
import React from 'react';
import './OurSolutions.css';

export default function SolutionStyleOne({ solutions }) {
  return (
    <div className="solutions-container style-one">
      {solutions.map((solution, index) => (
        <div className="solution-card" key={index}>
          <div className="solution-number">{solution.id}</div>
          <h3>{solution.title}</h3>
          <p>{solution.description}</p>
        </div>
      ))}
    </div>
  );
}