import React, { useState } from 'react';
import styles from "./Home.module.css";

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [descirption, setDescirption] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('high');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!title.trim()) {
    setError('Name is required');
    return;
  }
  setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        data: {
          title: title,
          descirption: descirption,
          date: date || null,
          time: time ? `${time}:00.000` : null,
          priority: priority,
        }
      };

      const response = await fetch(`${STRAPI_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error?.message || `Błąd ${response.status}`);
      }

      setSuccess(true);
      setTitle('');
      setDescirption('');
      setDate('');
      setTime('');
      setPriority('high');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pagecontainer}>
      <div className={styles.contactformcard}>
        <h2>Add Task</h2>
        <p className={styles.subtitle}>Plan your next step and stay organized</p>

        <form className={styles.contactform} onSubmit={handleSubmit}>

          <div className={styles.formgroup}>
            <label>Name</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formgroup}>
            <label>Description</label>
            <textarea
              className={styles.input}
              value={descirption}
              onChange={(e) => setDescirption(e.target.value)}
              placeholder="Describe your task..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formgroup}>
              <label>Date</label>
              <input
                type="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className={styles.formgroup}>
              <label>Time</label>
              <input
                type="time"
                className={styles.input}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formgroup}>
            <label>Priority</label>
            <select
              className={styles.input}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            type="submit"
            className={styles.btnsendMessage}
            disabled={loading}
          >
            {loading ? 'Adding Task...' : 'Add Task'}
          </button>

          {success && <p style={{ color: 'green', marginTop: '15px' }}>✅ Zadanie dodane pomyślnie!</p>}
          {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
