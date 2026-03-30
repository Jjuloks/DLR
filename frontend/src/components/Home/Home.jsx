import React from 'react';
import styles from "./Home.module.css"
export default function AddTask({ title, date, time, priority
})
{
    return (
       <div className="page-containter">
          
         <div className={styles.contactformcard}>
          <h2>Add Task</h2>

          <form className={styles.contactform}>
            <div className={styles.formgroup}>
              <label>Name</label>
              <input type="text" className={styles.input} />
            </div>
           
            <div className={styles.formgroup}>
              <label>Date</label>
              <input type="date" className={styles.input}/>
            </div>

             <div className={styles.formgroup}>
              <label>Time</label>
              <input type="time" className={styles.input}/>
            </div>

            <div className={styles.formgroup}>
              <label>Priority</label>
             <select>
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
