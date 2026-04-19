import styles  from  "./Progress.module.css"

function StatsBar() {
  return (
    <div className={styles.gd_stats_bar}>
      <div className={styles.gd_stat_card}>
        <div className={styles.gd_stat_label}>AVG PROGRESS</div>
        <div className={styles.gd_stat_value} style={{ color: "#6366f1" }}>0%</div>
      </div>

      <div className={styles.gd_stat_card}>
        <div className={styles.gd_stat_label}>ON TRACK</div>
        <div className={styles.gd_stat_value} style={{ color: "#10b981" }}>0/0</div>
      </div>

      <div className={styles.gd_stat_card}>
        <div className={styles.gd_stat_label}>SYSTEM ACTIONS</div>
        <div className={styles.gd_stat_value} style={{ color: "#f59e0b" }}>0</div>
      </div>

      <div className={styles.gd_stat_card}>
        <div className={styles.gd_stat_label}>TODAY</div>
        <div className={styles.gd_stat_value} style={{ color: "#ec4899" }}>0/0</div>
      </div>
    </div>
  );
}
function TodayPanel() {
  return (
    <div className={styles.gd_today}>
      <div className={styles.gd_today_header}>
        <div>
          <div className={styles.gd_today_title}>Today's Actions</div>
          <div className={styles.gd_today_date}>
            {new Date().toLocaleDateString("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className={styles.gd_today_count}>
          <span>0/0</span>
          <small>completed</small>
        </div>
      </div>

      <div className={styles.gd_today_empty}>Nothing scheduled for today</div>
    </div>
  );
}

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
     <StatsBar />
     <TodayPanel />
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