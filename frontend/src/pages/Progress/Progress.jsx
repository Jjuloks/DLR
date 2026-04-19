import styles  from  "./Progress.module.css"


export default function Progress() {
    return (
         <div className={styles.pagecontainer}>
         <div className={styles.gd_root}>
          <div className={styles.gd_header}>
            <div className={styles.gd_header_left}>
            <div className={styles.gd_eyebrow}>
        PROGRESS & GOALS
            </div>
            <h1 className={styles.gd_h1}>
              Your Goals
            </h1>
            <p className={styles.gd_subtitle}>Build the system. Let the results follow.</p>
            </div>
             <button className={styles.gd_btn_new}>+ New Goal</button>
          </div>
<div className={styles.gd_tabs}>
        <button className={styles.gd_tab_active}>Goals</button>
        <button className={styles.gd_tab}>Calendar</button>
      </div>
  <div className={styles.gd_body}>
        <div className={styles.gd_filter_row}>
          <button className={styles.gd_filter_btn_active}>All Goals</button>
          <button className={styles.gd_filter_btn}>Short-Term</button>
          <button className={styles.gd_filter_btn}>Long-Term</button>
        </div>

        <div className={styles.gd_empty}>
          <div className={styles.gd_empty_icon}>🎯</div>
          <div className={styles.gd_empty_title}>No goals yet</div>
          <p>Set your first goal and build a system to reach it.</p>
        </div>

      </div>


         </div>
    </div>
  );
}