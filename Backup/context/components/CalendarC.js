'use client';  // This marks this as a client-side component

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarC = () => {
  const [date, setDate] = useState(new Date());
  const [meetings] = useState([
    {
      date: '2025-02-22',
      title: 'Team Meeting',
      time: '10:00 AM',
    },
    {
      date: '2025-02-25',
      title: 'Client Call',
      time: '2:00 PM',
    },
    {
      date: '2025-02-26',
      title: 'Interview',
      time: '11:30 AM',
    },
  ]);

  const [formattedDate, setFormattedDate] = useState('');

  // Helper function to check if there are meetings on the selected date
  const getMeetingsOnDate = (date) => {
    const dateString = date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    return meetings.filter((meeting) => meeting.date === dateString);
  };

  // Function to format date in "Day Month Year" format
  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);  // Format as "27 January 2025"
  };

  useEffect(() => {
    setFormattedDate(formatDate(date));  // Set the formatted date for client-side rendering
  }, [date]);

  return (
    <div className="calendar-container bg-white p-6">
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date, view }) => {
          if (getMeetingsOnDate(date).length > 0) {
            return 'bg-blue-500 text-white'; // Highlight days with meetings
          }
        }}
        aria-label={formattedDate}  // Use client-side formatted date
        // Optional props to avoid undefined errors
        formatDay={(locale, date) => date.getDate()}  // Default to showing the day of the month
        formatLongDate={(locale, date) => date.toLocaleDateString('en-GB')} // Default long date format
        locale="en-GB"  // Ensuring locale is set correctly
        minDate={new Date('2025-01-01')}  // Optional, set a minimum date if needed
        maxDate={new Date('2025-12-31')}  // Optional, set a maximum date if needed
      />

      {/* Display meetings for the selected date */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Meetings on {formattedDate}:</h3>
        <ul className="list-none mt-2">
          {getMeetingsOnDate(date).length === 0 ? (
            <p className="text-sm text-gray-600">No meetings scheduled.</p>
          ) : (
            getMeetingsOnDate(date).map((meeting, index) => (
              <li key={index} className="mt-2 p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-blue-50 transition-all">
                <p className="font-medium text-gray-800">{meeting.title}</p>
                <p className="text-sm text-gray-600">{meeting.time}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CalendarC;
