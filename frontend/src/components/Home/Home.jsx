import React from 'react';
import styles from "./Home.module.css"
export default function AddTask({ title, date, time, priority
})
{
    return (
       <div className={styles.pagecontainer}>
          
         <div className={styles.contactformcard}>
          <h2>Add Task</h2>
<p className={styles.subtitle}>Plan your next step and stay organized</p>
          <form className={styles.contactform}>
            <div className={styles.formgroup}>
              <label>Name</label>
              <input type="text" className={styles.input} />
            </div>
           
        <div className={styles.row}>
  <div className={styles.formgroup}>
    <label>Date</label>
    <input type="date" className={styles.input}/>
  </div>

  <div className={styles.formgroup}>
    <label>Time</label>
    <input type="time" className={styles.input}/>
  </div>
</div>

            <div className={styles.formgroup}>
              <label>Priority</label>
             <select className={styles.input}>
              <option >Low</option>
              <option>Medium</option>
              <option>High</option>
             </select>
            </div>

            <button type="submit" className={styles.btnsendMessage}>
            Add Task
            </button>
          </form>
        </div>
        </div>
    );
}
