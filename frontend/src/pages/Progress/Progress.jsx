import { useState } from "react";
import styles  from  "./Progress.module.css"

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

/*CONSTANTS */
const CATEGORIES = ["Health & Fitness", "Learning", "Career", "Finance", "Personal", "Creative", "Relationships"];
const CATEGORY_COLORS = {
  "Health & Fitness": "#10b981",
  "Learning": "#6366f1",
  "Career": "#f59e0b",
  "Finance": "#14b8a6",
  "Personal": "#ec4899",
  "Creative": "#f97316",
  "Relationships": "#8b5cf6",
};
const goalTypes = [
  { value: "short-term", label: "Short-Term", activeClass: "active-short" },
  { value: "long-term", label: "Long-Term", activeClass: "active-long" },
];


function AddGoalForm({onClose}){
const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [startDate,setStartDate] = useState("01/01/2026");
const [endDate, setEndDate] = useState("07/07/2026");
const [goaltype,setGoalType] = useState("short-term");
const [category,setCategory] = useState(CATEGORIES[0]);
const [step,setStep] = useState("goal");
const [loading, setLoading]         = useState(false);
const [error, setError]             = useState(null);
const [success, setSuccess]         = useState(false);

const handleSubmit = async (e) =>{
   e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

     try {
      const payload = {
        data: {
          title : title,
          description : description,
          startDate: startDate || null,
          endDate: endDate || null,
          goalType : goaltype,
          category : category,
        },
      };

      const response = await fetch(`${STRAPI_URL}/api/goals`, {
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
        setStartDate('');
        setEndDate('');
        setGoalType('short-term');
        setCategory('');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
 

}

 return (
    <div className={styles.gd_overlay}>
      <div className={styles.gd_modal}>

        <div className={styles.gd_modal_header}>
          <div className={styles.gd_modal_eyebrow}>PROGRESS & GOALS</div>
          <div className={styles.gd_modal_title}>
            {step === "goal" ? "Define Your Goal" : "Build Your System"}
          </div>
        </div>

        <div className={styles.gd_modal_body}>

          <div className={styles.gd_modal_steps}>
            <button
              onClick={() => setStep("goal")}
              className={`${styles.gd_step_btn} ${step === "goal" ? styles.active : ""}`}>
              1. Goal Details
            </button>
            <button
              onClick={() => setStep("system")}
              className={`${styles.gd_step_btn} ${step === "system" ? styles.active : ""}`}>
              2. Action System
            </button>
          </div>

          {step === "goal" ? (
            <div className={styles.gd_form}>

              <div className={styles.gd_field}>
                <label className={styles.gd_label}>GOAL TITLE</label>
                <input
                  className={styles.gd_input}
                  placeholder="What do you want to achieve?"
                  value={title}
                  onChange={e => setTitle(e.target.value)} />
              </div>

              <div className={styles.gd_field}>
                <label className={styles.gd_label}>DESCRIPTION</label>
                <textarea
                  className={styles.gd_input_textarea}
                  placeholder="What does success look like?"
                  value={description}
                  onChange={e => setDescription(e.target.value)} />
              </div>

              <div className={styles.gd_row_2}>
                <div className={styles.gd_field}>
                  <label className={styles.gd_label}>START DATE</label>
                  <input
                    type="date"
                    className={styles.gd_input}
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className={styles.gd_field}>
                  <label className={styles.gd_label}>DEADLINE</label>
                  <input
                    type="date"
                    className={styles.gd_input}
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className={styles.gd_field}>
                <label className={styles.gd_label}>GOAL TYPE</label>
                <div className={styles.gd_toggle_row}>
                  <button
                    onClick={() => setGoalType("short-term")}
                    className={`${styles.gd_toggle_btn} ${goaltype === "short-term" ? styles.active_short : ""}`}>
                    Short-Term
                  </button>
                  <button
                    onClick={() => setGoalType("long-term")}
                    className={`${styles.gd_toggle_btn} ${goaltype === "long-term" ? styles.active_long : ""}`}>
                    Long-Term
                  </button>
                </div>
              </div>

              <div className={styles.gd_field}>
                <label className={styles.gd_label}>CATEGORY</label>
                <div className={styles.gd_chip_row}>
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`${styles.gd_chip} ${category === c ? styles.active : ""}`}
                      style={category === c ? { borderColor: CATEGORY_COLORS[c], color: CATEGORY_COLORS[c], background: `${CATEGORY_COLORS[c]}18` } : {}}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className={styles.gd_error}>{error}</div>}
              {success && <div className={styles.gd_success}>Goal created!</div>}

              <div className={styles.gd_modal_actions}>
                <button className={styles.gd_btn_ghost} onClick={onClose}>Cancel</button>
                <button
                  className={styles.gd_btn_primary}
                  onClick={() => setStep("system")}>
                  Next: Build Your System →
                </button>
              </div>

            </div>
          ) : (
            <div className={styles.gd_form}>

              <div className={styles.gd_modal_actions}>
                <button className={styles.gd_btn_ghost} onClick={() => setStep("goal")}>← Back</button>
                <button
                  className={styles.gd_btn_primary}
                  onClick={handleSubmit}
                  disabled={loading || !title.trim() || !endDate}>
                  {loading ? "Creating..." : "Create Goal"}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}


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
    const [showForm, setShowForm] = useState(false);
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
             <button className={styles.gd_btn_new} onClick={() => setShowForm(true)}>+ New Goal</button>
          </div>
             {showForm && <AddGoalForm onClose={() => setShowForm(false)} />}
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