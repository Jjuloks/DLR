import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'
import EventModal from './EventModal'
const localizer = momentLocalizer(moment)

export default function MyCalendar({events = []}) {
     const [date, setDate] = useState(new Date())
    const [view, setView] = useState('month')
    const [selectedEvent, setSelectedEvent] = useState(null)

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
        onSelectEvent={(event) => setSelectedEvent(event)}
      />
       <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}