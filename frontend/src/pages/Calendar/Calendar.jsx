import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'
import styles from './Calendar.module.css'
import EventModal from './EventModal'

const localizer = momentLocalizer(moment)

function CustomToolbar({ label, onNavigate, onView, view }) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <div className={styles.navGroup}>
          <button className={styles.navBtn} onClick={() => onNavigate('PREV')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={styles.navBtn} onClick={() => onNavigate('NEXT')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <span className={styles.toolbarLabel}>{label}</span>
      </div>
      <div className={styles.toolbarRight}>
        <button className={styles.todayBtn} onClick={() => onNavigate('TODAY')}>Today</button>
        <div className={styles.viewSwitcher}>
          {['month', 'week', 'day', 'agenda'].map(v => (
            <button
              key={v}
              onClick={() => onView(v)}
              className={`${styles.viewBtn} ${view === v ? styles.viewBtnActive : ''}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function getStatsFromEvents(events) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  const thisMonthEvents = events.filter(e => {
    const d = new Date(e.start)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const upcomingThisWeek = events.filter(e => {
    const d = new Date(e.start)
    return d >= now && d <= endOfWeek
  })

  const totalHours = thisMonthEvents.reduce((sum, e) => {
    const diff = (new Date(e.end) - new Date(e.start)) / 3600000
    return sum + diff
  }, 0)

  const nextEvent = events
    .filter(e => new Date(e.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))[0]

  return [
    {
      label: 'Events this month',
      value: thisMonthEvents.length.toString(),
      sub: `${events.length} total across all time`,
      color: '#6366f1',
    },
    {
      label: 'Upcoming this week',
      value: upcomingThisWeek.length.toString(),
      sub: nextEvent ? `Next: ${nextEvent.title}` : 'No upcoming events',
      color: '#f59e0b',
    },
    {
      label: 'Hours scheduled',
      value: `${Math.round(totalHours)}h`,
      sub: `Across ${thisMonthEvents.length} events this month`,
      color: '#10b981',
    },
    {
      label: 'Overdue tasks',
      value: events.filter(e => new Date(e.end) < now).length.toString(),
      sub: 'Past end date',
      color: '#ec4899',
    },
  ]
}

export default function MyCalendar({ events = [] }) {
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState('month')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const stats = getStatsFromEvents(events)

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.calendarCard}>
        <div style={{ height: '720px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={date}
            view={view}
            onNavigate={setDate}
            onView={setView}
            onSelectEvent={setSelectedEvent}
            components={{ toolbar: CustomToolbar }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: (event.color || '#6366f1') + '18',
                borderLeft: `2.5px solid ${event.color || '#6366f1'}`,
                color: event.color || '#6366f1',
                boxShadow: 'none',
                borderRadius: '0 5px 5px 0',
                border: 'none',
                fontSize: '11px',
                fontWeight: '600',
                padding: '3px 8px',
              }
            })}
          />
        </div>
      </div>


      <div className={styles.statsRow}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statCardTop}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statDot} style={{ background: stat.color }} />
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statSub}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}