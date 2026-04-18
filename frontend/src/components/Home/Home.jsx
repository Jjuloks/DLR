import React, { useState } from 'react';
import styles from './Home.module.css';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export default function AddTask() {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate]               = useState('');
  const [dateEnd, setDateEnd]         = useState('');
  const [priority, setPriority]       = useState('high');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Task name is required'); return; }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        data: {
          title,
          descirption: description,
          date: date || null,
          dateEnd: dateEnd || null,
          priority,
        },
      };

      const response = await fetch(`${STRAPI_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error?.message || `Error ${response.status}`);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setDescription('');
        setDate('');
        setDateEnd('');
        setPriority('high');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const btnClass = [
    styles.btnsendMessage,
    loading ? styles.loading : '',
    success ? styles.success : '',
  ].join(' ');

  return (
    <div className={styles.pagecontainer}>
      <div className={styles.contactformcard}>

        {/* Header */}
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.headerMeta}>Daily Routine</p>
            <h2 className={styles.cardTitle}>Add New Task</h2>
            <p className={styles.subtitle}>Plan your next step and stay organized</p>
          </div>
          <div className={styles.headerIcon}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V15M3 9H15" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Form */}
        <form className={styles.contactform} onSubmit={handleSubmit}>

          {/* Name */}
          <div className={styles.formgroup}>
            <label>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M2 6h6M2 9h4" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Task Name
            </label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              style={{ borderColor: title ? '#6366f1' : undefined }}
            />
          </div>

          {/* Description */}
          <div className={styles.formgroup}>
            <label>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" stroke="#9ca3af" strokeWidth="1.4"/>
                <path d="M3.5 4.5H8.5M3.5 6H7M3.5 7.5H6.5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Description
            </label>
            <textarea
              className={styles.input}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
            />
          </div>

          {/* Dates */}
          <div className={styles.row}>
            <div className={styles.formgroup}>
              <label>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1.5" y="2.5" width="9" height="8" rx="1.5" stroke="#9ca3af" strokeWidth="1.4"/>
                  <path d="M4 1.5V3.5M8 1.5V3.5" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M1.5 5.5H10.5" stroke="#9ca3af" strokeWidth="1.2"/>
                </svg>
                Start
              </label>
              <input
                type="datetime-local"
                className={styles.input}
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className={styles.formgroup}>
              <label>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1.5" y="2.5" width="9" height="8" rx="1.5" stroke="#9ca3af" strokeWidth="1.4"/>
                  <path d="M4 1.5V3.5M8 1.5V3.5" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M1.5 5.5H10.5" stroke="#9ca3af" strokeWidth="1.2"/>
                </svg>
                End
              </label>
              <input
                type="datetime-local"
                className={styles.input}
                value={dateEnd}
                onChange={e => setDateEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Priority */}
          <div className={styles.formgroup}>
            <label>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10V7M2 7V4L5.5 2L9 4L12 2V8L9 10L5.5 8L2 10Z" stroke="#9ca3af" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
              Priority
            </label>
            <select
              className={styles.input}
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className={btnClass} disabled={loading || success}>
            {success ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Task Added!
              </>
            ) : loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.spinIcon}>
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                  <path d="M8 2A6 6 0 0 1 14 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Adding Task...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Task
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className={styles.errorBanner}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#ef4444" strokeWidth="1.4"/>
                <path d="M7 4.5V7.5M7 9.5V9.6" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}