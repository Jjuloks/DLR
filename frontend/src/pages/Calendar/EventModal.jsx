import styles from "./Calendar.module.css";

const PRIORITY_CONFIG = {
  high:   { color: '#fca5a5', bg: '#7f1d1d', label: 'High' },
  medium: { color: '#fde68a', bg: '#78350f', label: 'Medium' },
  low:    { color: '#86efac', bg: '#14532d', label: 'Low' },
};

function getDuration(start, end) {
  const diff = Math.round((end - start) / 60000);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export default function EventModal({ event, onClose }) {
  if (!event) return null;
  const priority = PRIORITY_CONFIG[event.priority];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalHeaderLabel}>Task</p>
            <h2 className={styles.modalTitle}>{event.title}</h2>
            {priority && (
              <span style={{
                background: priority.bg,
                color: priority.color,
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '500',
              }}>
                {priority.label}
              </span>
            )}
          </div>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          {event.description && (
            <div className={styles.modalField}>
              <p className={styles.modalFieldLabel}>Description</p>
              <p className={styles.modalFieldValue}>{event.description}</p>
            </div>
          )}

          <div className={styles.modalGrid}>
            <div className={styles.modalField}>
              <p className={styles.modalFieldLabel}>Start</p>
              <p className={styles.modalFieldValue}>{event.start.toLocaleDateString('pl-PL')}</p>
              <p className={styles.modalTime}>{event.start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className={styles.modalField}>
              <p className={styles.modalFieldLabel}>End</p>
              <p className={styles.modalFieldValue}>{event.end.toLocaleDateString('pl-PL')}</p>
              <p className={styles.modalTime}>{event.end.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <span className={styles.modalDuration}>
              Duration: <strong>{getDuration(event.start, event.end)}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}