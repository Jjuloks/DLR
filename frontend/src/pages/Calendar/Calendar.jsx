import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function MyCalendar() {
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
      />
    </div>
  )
}