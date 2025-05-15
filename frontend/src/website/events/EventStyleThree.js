// src/components/EventStyleThree.js
import React from 'react';
import './LatestEvents.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function EventStyleThree({ events }) {
  return (
    <div className="events-container style-three">
      {events.map((event, index) => (
        <div className="event-item" key={index}>
          <img src={event.img} alt={event.title} className="event-image" />
          <div className="event-content">
            <h3>{event.title}</h3>
            <p>{event.desc}</p>
            <div className="event-date">
              <CalendarMonthIcon className="calendar-icon" />
              <span>{event.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}