import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'

const localizer = momentLocalizer(moment)

export default function MyCalendar() {
     const [date, setDate] = useState(new Date())
    const [view, setView] = useState('month')
  const events = [
    {
      title: 'My Task',
      start: new Date(2026, 3, 17, 10, 0), // year, month(0-indexed), day, hour, min
      end: new Date(2026, 3, 17, 11, 0),
    }
  ]

  return (
    <div style={{ height: '600px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        view={view}
        onNavigate={(newDate) => setDate(newDate)}
        onView={(newView) => setView(newView)}
      />
    </div>
  )
}