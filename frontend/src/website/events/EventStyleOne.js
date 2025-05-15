import React from 'react';
import './LatestEvents.css';

export default function EventStyleOne({ events }) {
  return (
    <div className="events-container style-one">
      <div className="events-intro">
        <h2>OUR LATEST EVENTS</h2>
        <p>
          DISCOVER ALL THE NEWS AND NOVELTIES OF OUR COMPANY
        </p>
      </div>
      <div className="events-list">
        {events.map((event, index) => (
          <div className="event-item" key={index}>
            <div className="event-header">
              <span className="event-date">{event.date}</span>
              <h3>{event.title}</h3>
            </div>
            <p>{event.desc}</p>
            <button>Learn More</button>
          </div>
        ))}
      </div>
    </div>
  );
}